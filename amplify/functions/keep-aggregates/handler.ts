import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import type { DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";

const GENERAL_AGGREGATES_TABLE_NAME = process.env.GENERAL_AGGREGATES_TABLE_NAME;
const REVIEW_TABLE_NAME = process.env.REVIEW_TABLE_NAME;
const PRODUCT_TABLE_NAME = process.env.PRODUCT_TABLE_NAME;

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "keep-aggregates",
});

const dynamoDBClient = new DynamoDBClient({ region: process.env.AWS_REGION });

// Receives events from Product and Review tables

export const handler: DynamoDBStreamHandler = async (event) => {
  if (
    !GENERAL_AGGREGATES_TABLE_NAME ||
    !REVIEW_TABLE_NAME ||
    !PRODUCT_TABLE_NAME
  ) {
    console.error("Table names are not defined.", {
      GENERAL_AGGREGATES_TABLE_NAME,
    });
    return;
  }

  for (const record of event.Records) {
    if (!record.eventSourceARN || !record.eventName) {
      continue;
    }

    const eventSourceTableName = record.eventSourceARN.split("/")[1];
    if (record.eventName === "INSERT" || record.eventName === "REMOVE") {
      const isInsert = record.eventName === "INSERT";
      const increment = isInsert ? 1 : -1;

      logger.info(
        `Received ${record.eventName} event from ${eventSourceTableName}`
      );

      if (eventSourceTableName.includes(PRODUCT_TABLE_NAME)) {
        await updateCount(GENERAL_AGGREGATES_TABLE_NAME, "Product", increment);
      } else if (eventSourceTableName.includes(REVIEW_TABLE_NAME)) {
        await updateCount(GENERAL_AGGREGATES_TABLE_NAME, "Review", increment);
      }
    }
  }
};

const updateCount = async (
  tableName: string,
  entityType: string,
  increment: number
) => {
  const marshalledKey = marshall({ entityType });

  logger.info(
    `Updating count for ${entityType} in ${tableName} by ${increment} with key:`,
    marshalledKey
  );

  const params = {
    TableName: tableName,
    Key: marshall({ entityType }),
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
  };

  try {
    await dynamoDBClient.send(new UpdateItemCommand(params));
  } catch (error) {
    console.error(`Failed to update count in ${tableName}:`, error);
  }
};
