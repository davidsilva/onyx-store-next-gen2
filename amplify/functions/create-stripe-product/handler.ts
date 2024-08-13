/* 
When there is an INSERT event in the DynamoDB Product table, this handler will call the Stripe API to create a product and price. Those values will then be stored in the Product table as stripeProductId and stripePriceId for the newly created product.

But first, to test things out, let's just do some logging when an INSERT event occurs.
*/
import type { DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "dynamodb-stream-handler",
});

export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    logger.info(`Processing record: ${record.eventID}`);
    logger.info(`Event Type: ${record.eventName}`);

    if (record.eventName === "INSERT") {
      // business logic to process new records
      logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
    }
  }
  logger.info(`Successfully processed ${event.Records.length} records.`);
  
  return {
    batchItemFailures: [],
  };
};