import {
  AttributeValue,
  DynamoDBClient,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import type { DynamoDBRecord, DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { SentimentType } from "@aws-sdk/client-comprehend";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "update-sentiment-counts",
});

const dynamoDBClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const SENTIMENT_COUNTS_TABLE_NAME = process.env.SENTIMENT_COUNTS_TABLE_NAME;

const isValidSentimentType = (value: any): value is SentimentType => {
  return Object.values(SentimentType).includes(value);
};

const handleModifyEvent = async (record: DynamoDBRecord) => {
  logger.info("Handling MODIFY event", { record });
  if (!record.dynamodb?.NewImage || !record.dynamodb?.OldImage) {
    return;
  }
  const newImage = unmarshall(
    record.dynamodb.NewImage as Record<string, AttributeValue>
  );
  const oldImage = unmarshall(
    record.dynamodb.OldImage as Record<string, AttributeValue>
  );

  if (oldImage.sentiment !== newImage.sentiment) {
    if (isValidSentimentType(newImage.sentiment)) {
      logger.info("Updating sentiment count for new sentiment", {
        sentiment: newImage.sentiment,
      });
      await updateSentimentCounts(newImage.sentiment, 1);
    } else {
      logger.warn("Invalid new sentiment type", {
        sentiment: newImage.sentiment,
      });
    }
    if (isValidSentimentType(oldImage.sentiment)) {
      logger.info("Updating sentiment count for old sentiment", {
        sentiment: oldImage.sentiment,
      });
      await updateSentimentCounts(oldImage.sentiment, -1);
    } else {
      logger.warn("Invalid old sentiment type", {
        sentiment: oldImage.sentiment,
      });
    }
  }
};

const handleRemoveEvent = async (record: DynamoDBRecord) => {
  if (!record.dynamodb?.OldImage) {
    return;
  }
  const oldImage = unmarshall(
    record.dynamodb.OldImage as Record<string, AttributeValue>
  );

  if (isValidSentimentType(oldImage.sentiment)) {
    logger.info("Updating sentiment count for removed sentiment", {
      sentiment: oldImage.sentiment,
    });
    await updateSentimentCounts(oldImage.sentiment, -1);
  } else {
    logger.warn("Invalid old sentiment type", {
      sentiment: oldImage.sentiment,
    });
  }
};

const updateSentimentCounts = async (
  sentiment: SentimentType,
  increment: number
) => {
  const params = {
    TableName: SENTIMENT_COUNTS_TABLE_NAME,
    Key: marshall({ sentiment }),
    UpdateExpression: "ADD #count :increment",
    ExpressionAttributeNames: { "#count": "count" },
    ExpressionAttributeValues: { ":increment": { N: increment.toString() } },
  };

  try {
    await dynamoDBClient.send(new UpdateItemCommand(params));
    logger.info("Sentiment count updated", { sentiment, increment });
  } catch (error) {
    logger.error("Error updating sentiment count", {
      sentiment,
      increment,
      error,
    });
  }
};

export const handler: DynamoDBStreamHandler = async (event) => {
  logger.info("update-sentiment-counts received event", { event });
  for (const record of event.Records) {
    if (record.eventName === "MODIFY") {
      await handleModifyEvent(record);
    } else if (record.eventName === "REMOVE") {
      await handleRemoveEvent(record);
    }
  }
};
