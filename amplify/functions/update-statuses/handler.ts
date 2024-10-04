import {
  DynamoDBClient,
  UpdateItemCommand,
  AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import type { DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";

const PRODUCT_STATUSES_TABLE_NAME = process.env.PRODUCT_STATUSES_TABLE_NAME;
const PRODUCT_TABLE_NAME = process.env.PRODUCT_TABLE_NAME;
const REVIEW_STATUSES_TABLE_NAME = process.env.REVIEW_STATUSES_TABLE_NAME;
const REVIEW_TABLE_NAME = process.env.REVIEW_TABLE_NAME;

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "update-statuses",
});

const dynamoDBClient = new DynamoDBClient({ region: process.env.AWS_REGION });

// Update count in DynamoDB
const updateCount = async (
  tableName: string,
  status: string,
  increment: number
) => {
  const params = {
    TableName: tableName,
    Key: marshall({ status }),
    UpdateExpression:
      "SET #count = if_not_exists(#count, :zero) + :increment, #updatedAt = :now, #createdAt = if_not_exists(#createdAt, :now)",
    ExpressionAttributeNames: {
      "#count": "count",
      "#updatedAt": "updatedAt",
      "#createdAt": "createdAt",
    },
    ExpressionAttributeValues: {
      ":increment": { N: increment.toString() },
      ":zero": { N: "0" },
      ":now": { S: new Date().toISOString() },
    },
    ConditionExpression: increment > 0 ? undefined : "#count > :zero",
  };

  const command = new UpdateItemCommand(params);

  try {
    await dynamoDBClient.send(command);
    logger.info(`Updated count. Table name: ${tableName}. Status: ${status}.`);
  } catch (error) {
    logger.error(
      `Error updating count. Table name: ${tableName}. Status: ${status}.`,
      { error }
    );
  }
};

export const handler: DynamoDBStreamHandler = async (event) => {
  //   logger.info("update-statuses received event", { event });
  if (
    !PRODUCT_STATUSES_TABLE_NAME ||
    !PRODUCT_TABLE_NAME ||
    !REVIEW_STATUSES_TABLE_NAME ||
    !REVIEW_TABLE_NAME
  ) {
    logger.error("Table names are not defined.", {
      PRODUCT_STATUSES_TABLE_NAME,
      PRODUCT_TABLE_NAME,
      REVIEW_STATUSES_TABLE_NAME,
      REVIEW_TABLE_NAME,
    });
    return;
  }

  for (const record of event.Records) {
    if (!record.eventSourceARN || !record.eventName) {
      continue;
    }

    const eventSourceTableName = record.eventSourceARN.split("/")[1];
    const newImage = record.dynamodb?.NewImage
      ? unmarshall(record.dynamodb.NewImage as Record<string, AttributeValue>)
      : undefined;
    const oldImage = record.dynamodb?.OldImage
      ? unmarshall(record.dynamodb.OldImage as Record<string, AttributeValue>)
      : undefined;

    // logger.info(`Processing record`, {
    //   eventSourceTableName,
    //   PRODUCT_TABLE_NAME,
    //   REVIEW_TABLE_NAME,
    //   record,
    //   newImage,
    //   oldImage,
    // });

    if (record.eventName === "INSERT" || record.eventName === "REMOVE") {
      const isInsert = record.eventName === "INSERT";
      const increment = isInsert ? 1 : -1;
      const status = isInsert ? newImage?.status : oldImage?.status;

      if (status) {
        await updateCount(
          eventSourceTableName.includes(PRODUCT_TABLE_NAME)
            ? PRODUCT_STATUSES_TABLE_NAME
            : REVIEW_STATUSES_TABLE_NAME,
          status,
          increment
        );
      }
    } else {
      // MODIFY event
      const oldStatus = oldImage?.status;
      const newStatus = newImage?.status;
      logger.info(`Old status: ${oldStatus}, New status: ${newStatus}`);
      if (newStatus && oldStatus && newStatus !== oldStatus) {
        await updateCount(
          eventSourceTableName.includes(PRODUCT_TABLE_NAME)
            ? PRODUCT_STATUSES_TABLE_NAME
            : REVIEW_STATUSES_TABLE_NAME,
          oldStatus,
          -1
        );
        await updateCount(
          eventSourceTableName.includes(PRODUCT_TABLE_NAME)
            ? PRODUCT_STATUSES_TABLE_NAME
            : REVIEW_STATUSES_TABLE_NAME,
          newStatus,
          1
        );
      }
    }
  }
};
