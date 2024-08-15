/* 
When there is an INSERT event in the DynamoDB Product table, this handler will call the Stripe API to create a product and price. Those values will then be stored in the Product table as stripeProductId and stripePriceId for the newly created product.
*/
import {
  DynamoDBClient,
  UpdateItemCommand,
  AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import type { DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import Stripe from "stripe";

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

    if (record.eventName === "INSERT") {
      logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
      if (record.dynamodb?.NewImage) {
        // business logic to process new records
        const newImage = record.dynamodb.NewImage as Record<
          string,
          AttributeValue
        >;
        const newProduct = unmarshall(newImage);

        const stripeProductId = await createStripeProductId({
          name: newProduct.name,
          description: newProduct.description,
        });

        const stripePriceId = await createStripePriceId({
          stripeProductId,
          price: newProduct.price,
        });

        try {
          await updateProductWithStripeIds(
            newProduct.id,
            stripeProductId,
            stripePriceId
          );
          logger.info(
            `Successfully updated product ${newProduct.id} with Stripe IDs. Product table name is ${process.env.PRODUCT_TABLE_NAME}`
          );
        } catch (error) {
          logger.error(`Error updating product with Stripe IDs: ${error}`);
        }
      } else {
        logger.warn("No NewImage found in record.");
      }
    }
  }
  logger.info(`Successfully processed ${event.Records.length} records.`);

  return {
    batchItemFailures: [],
  };
};

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
}: {
  name: string;
  description: string;
}) {
  if (!name || !description) {
    return Promise.reject("Name and description are required");
  }

  const stripe = await getStripeClient();

  const stripeProduct = await stripe.products.create({ name, description });

  return stripeProduct.id;
}

async function createStripePriceId(input: {
  stripeProductId: string;
  price: number;
}) {
  if (!input.price) {
    return Promise.reject("Price is required");
  }

  const stripe = await getStripeClient();

  const stripePrice = await stripe.prices.create({
    product: input.stripeProductId,
    unit_amount: input.price, // in cents
    currency: "usd",
  });

  return stripePrice.id;
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
  await dynamoDBClient.send(command);
}
