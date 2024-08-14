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

        const stripeProductId = "prod_123";
        const stripePriceId = "price_123";

        try {
          await updateProductWithStripeIds(
            newProduct.id,
            stripeProductId,
            stripePriceId
          );
          logger.info(
            `Successfully updated product ${newProduct.id} with Stripe IDs.`
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

async function updateProductWithStripeIds(
  productId: string,
  stripeProductId: string,
  stripePriceId: string
) {
  const params = {
    TableName: "Product-ckawyp75tjgkbgnvn2ypbsssgq-NONE",
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
