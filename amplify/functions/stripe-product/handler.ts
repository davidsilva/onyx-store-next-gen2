/* 
When there is an INSERT event in the DynamoDB Product table, this handler will call the Stripe API to create a product and price. Those values will then be stored in the Product table as stripeProductId and stripePriceId for the newly created product.

The UPDATE event calls the Stripe API to update the product and price with the new values.

The REMOVE event is not handled in this example, but you *could* add logic to delete the product and price from Stripe when a product is deleted from the Product table. But our app generally wants to do soft deletes, so we might mimic that behavior in Stripe by deactivating the product and price instead of deleting them.

Possible improvements:

* Retry logic in case of network or Stripe API errors.
* Dead Letter Queue for failed events. I.e., use an SQS queue to store failed events and then process them later.
* Set up CloudWatch alarms to monitor the number of failed events.
* Idempotency: Add idempotency keys to Stripe API calls to prevent duplicate requests.
* Show some indication in the UI regarding the status of the Stripe product and price. E.g., show a spinner while the product and price are being created or updated. In most cases, the Stripe API calls should be fast -- and it might be a distraction to show a status. But if the Stripe product and price IDs are pending, and therefore the product can't be purchased, we want to show that to the admin. There could be a display on an admin dashboard that shows the status of Stripe and any other third-party integrations.

In a more complicated app, we could create an SNS topic for DynamoDB Stream events. We could use some combination of SQS, SNS, Kinesis and EventBridge to integerate multiple apps, provide an API for third-party developers.... But for *this* little app, where we might end up Stripe as the only third-party integration, and maybe AWS Comprehend as the only other service where there would be an independent process, we can keep things simple. Like, instead of binary statuses for a Product, e.g., isArchived, isActive, we could multiple states to reflect pending Stripe product and price IDs, awaiting approval, etc., and then reflect those states in the UI on the admin dashboard, product page, etc.
*/
import {
  DynamoDBClient,
  UpdateItemCommand,
  AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import type { DynamoDBRecord, DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import Stripe from "stripe";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  isArchived: boolean;
  stripeProductId: string;
  stripePriceId: string;
};

type StripeProductInput = {
  name: string;
  description: string;
  isActive?: boolean;
};

type StripePriceInput = {
  stripeProductId: string;
  price: number;
};

let stripe: Stripe;

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "dynamodb-stream-handler",
});

const dynamoDBClient = new DynamoDBClient({ region: process.env.AWS_REGION });

export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    logger.info(`Processing record: ${record.eventID}`);
    logger.info(`Event Type: ${record.eventName}`);

    switch (record.eventName) {
      case "INSERT":
        await processInsert(record);
        break;
      case "MODIFY":
        await processModify(record);
        break;
      case "REMOVE":
        await processRemove(record);
        break;
      default:
        logger.warn(`Unsupported event type: ${record.eventName}`);
    }
  }
  logger.info(`Successfully processed ${event.Records.length} records.`);

  return {
    batchItemFailures: [],
  };
};

async function processInsert(record: DynamoDBRecord) {
  logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
  if (record.dynamodb?.NewImage) {
    // business logic to process new records
    const newImage = record.dynamodb.NewImage as Record<string, AttributeValue>;
    const newProduct = unmarshall(newImage);

    try {
      const stripeProductId = await createStripeProductId({
        name: newProduct.name,
        description: newProduct.description,
      });

      const stripePriceId = await createStripePriceId({
        stripeProductId,
        price: newProduct.price,
      });

      await updateProductWithStripeIds(
        newProduct.id,
        stripeProductId,
        stripePriceId
      );
      logger.info(
        `Successfully updated product ${newProduct.id} with Stripe IDs. Product table name is ${process.env.PRODUCT_TABLE_NAME}`
      );
    } catch (error) {
      const err = error as Error;
      logger.error(`Error updating product with Stripe IDs: ${err.message}`);
    }
  } else {
    logger.warn("No NewImage found in record.");
  }
}

async function processModify(record: DynamoDBRecord) {
  // We can compare newImage and oldImage to determine what has changed -- and whether the Stripe API has to be called.
  // If the price has changed, we call the Stripe API to update the price. What that means is that we have to create a new price in Stripe (if one with that value and associated with the product doesn't exist) and then update the product to use the new price.
  // If name, description or isActive has changed, we call the Stripe API to update the product.
  // The Stripe Price object has an "active" property but I don't think there's a reason to have it match the Stripe Product object's "active" property. In the Stripe world, products can have multiple prices.
  logger.info(`MODIFY event: ${JSON.stringify(record.dynamodb)}`);

  try {
    const newImage = record.dynamodb?.NewImage as Record<
      string,
      AttributeValue
    >;
    const oldImage = record.dynamodb?.OldImage as Record<
      string,
      AttributeValue
    >;
    const newProduct = unmarshall(newImage);
    const oldProduct = unmarshall(oldImage);

    const propertiesToCheck = ["name", "description", "price", "isActive"];
    const changes = checkForChanges(newProduct, oldProduct, propertiesToCheck);

    if (changes.length > 0) {
      const productChanges = changes.filter((change) =>
        ["name", "description", "isActive"].includes(change.property)
      );
      const priceChanges = changes.filter(
        (change) => change.property === "price"
      );

      if (productChanges.length > 0) {
        // update the product in Stripe
        logger.info(`Product details have changed`);
        await updateStripeProduct(newProduct);
      }

      if (priceChanges.length > 0) {
        // update the price in Stripe
        logger.info(`Price has changed`);
        await updateStripePrice(newProduct);
      }

      changes.forEach((change) => {
        logger.info(
          `Property ${change.property} has changed from ${change.oldValue} to ${change.newValue}`
        );
      });
    } else {
      logger.info("No Stripe updates required.");
    }
  } catch (error) {
    const err = error as Error;
    logger.error(`Error processing MODIFY event: ${err.message}`);
    throw new Error(`Error processing MODIFY event: ${err.message}`);
  }
}

async function processRemove(record: DynamoDBRecord) {
  logger.info(`REMOVE event: ${JSON.stringify(record.dynamodb)}`);
}

async function getStripeSecretKey() {
  const ssmClient = new SSMClient({ region: process.env.AWS_REGION });
  const input = {
    // GetParameterRequest
    Name: "/stripe/STRIPE_SECURE_KEY", // required
    WithDecryption: true,
  };
  const command = new GetParameterCommand(input);
  const response = await ssmClient.send(command);
  return response.Parameter?.Value;
}

async function getStripeClient() {
  if (!stripe) {
    const secretKey = await getStripeSecretKey();
    if (!secretKey) {
      throw new Error("Stripe secret key not found.");
    }
    stripe = new Stripe(secretKey);
  }

  return stripe;
}

async function createStripeProductId({
  name,
  description,
}: StripeProductInput): Promise<string> {
  if (!name || !description) {
    return Promise.reject("Name and description are required");
  }

  try {
    const stripe = await getStripeClient();

    const stripeProduct = await stripe.products.create({ name, description });

    return stripeProduct.id;
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating Stripe product: ${err.message}`);
    throw new Error(`Error creating Stripe product: ${err.message}`);
  }
}

async function createStripePriceId(input: StripePriceInput): Promise<string> {
  if (!input.price) {
    return Promise.reject("Price is required");
  }

  try {
    const stripe = await getStripeClient();

    const stripePrice = await stripe.prices.create({
      product: input.stripeProductId,
      unit_amount: input.price, // in cents
      currency: "usd",
    });

    return stripePrice.id;
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating Stripe price: ${err.message}`);
    throw new Error(`Error creating Stripe price: ${err.message}`);
  }
}

async function updateStripeProduct(product: Record<string, any>) {
  try {
    const stripe = await getStripeClient();
    const stripeProduct = await stripe.products.update(
      product.stripeProductId,
      {
        name: product.name,
        description: product.description,
        active: product.isActive,
      }
    );
    logger.info(`Updated Stripe product: ${JSON.stringify(stripeProduct)}`);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating Stripe product: ${err.message}`);
    throw new Error(`Error updating Stripe product: ${err.message}`);
  }
}

async function updateStripePrice(product: Record<string, any>) {
  // With the Stripe API, you can't update the price directly. You have to create a new price and then update the product to use the new price. But we don't want to have multiple price objects with the same value and for the same product. So we check if a price with the same value already exists and use that instead of creating a new price.
  // Right now our simple store only supports a single price per product.
  try {
    const stripe = await getStripeClient();

    // Check for existing prices with the same value.
    const existingPrices = await stripe.prices.list({
      product: product.stripeProductId,
    });

    let newStripePrice;
    logger.info(`existingPrices.data ${JSON.stringify(existingPrices.data)}`);
    const existingPrice = existingPrices.data.find(
      (price) => price.unit_amount === product.price && price.currency === "usd"
    );
    logger.info(`existingPrice ${JSON.stringify(existingPrice)}`);
    if (existingPrice) {
      newStripePrice = existingPrice;
      // Restore the old price if it was deactivated.
      if (!existingPrice.active) {
        await stripe.prices.update(existingPrice.id, {
          active: true,
        });
      }
      logger.info(
        `Found existing Stripe price: ${JSON.stringify(newStripePrice)}`
      );
    } else {
      // Create a new price if no existing price matches.
      newStripePrice = await stripe.prices.create({
        product: product.stripeProductId,
        unit_amount: product.price, // in cents
        currency: "usd",
      });
      logger.info(
        `Created new Stripe price: ${JSON.stringify(newStripePrice)}`
      );
    }

    // Deactivate the old price
    const stripePrice = await stripe.prices.update(product.stripePriceId, {
      active: false,
    });
    logger.info(`Deactivated old Stripe price: ${JSON.stringify(stripePrice)}`);

    // Update the product to use the new price
    await updateProductWithStripeIds(
      product.id,
      product.stripeProductId,
      newStripePrice.id
    );
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating Stripe price: ${err.message}`);
    throw new Error(`Error updating Stripe price: ${err.message}`);
  }
}

async function updateProductWithStripeIds(
  productId: string,
  stripeProductId: string,
  stripePriceId: string
) {
  const params = {
    TableName: process.env.PRODUCT_TABLE_NAME,
    Key: marshall({ id: productId }),
    UpdateExpression:
      "SET stripeProductId = :stripeProductId, stripePriceId = :stripePriceId",
    ExpressionAttributeValues: marshall({
      ":stripeProductId": stripeProductId,
      ":stripePriceId": stripePriceId,
    }),
  };

  const command = new UpdateItemCommand(params);

  try {
    await dynamoDBClient.send(command);
    logger.info(`Updated product ${productId} with Stripe IDs`);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating product with Stripe IDs: ${err.message}`);
    throw new Error(`Error updating product with Stripe IDs: ${err.message}`);
  }
}

// return a list of fields that differ between objects
function checkForChanges(
  newObj: Record<string, any>,
  oldObj: Record<string, any>,
  properties: string[]
) {
  return properties
    .map((property) => ({
      property,
      oldValue: oldObj[property],
      newValue: newObj[property],
      hasChanged: oldObj[property] !== newObj[property],
    }))
    .filter((change) => change.hasChanged);
}
