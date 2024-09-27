import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import type { DynamoDBRecord, DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { Readable } from "stream";

const s3 = new S3Client({ region: process.env.AWS_REGION });
const bucketName = process.env.S3_BUCKET_NAME;
const reviewsKey = "reviews/reviews.txt";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "dynamodb-stream-handler",
});

const getObjectContent = async (
  bucket: string,
  key: string
): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await s3.send(command);
    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString("utf-8");
  } catch (error) {
    if (error instanceof Error && error.name === "NoSuchKey") {
      return "";
    }
    throw error;
  }
};

export const handler: DynamoDBStreamHandler = async (event) => {
  logger.info("Received event", { event });

  for (const record of event.Records) {
    logger.info("Processing record", { record });

    if (record.eventName !== "INSERT") {
      continue;
    }

    const dynamoRecord = record as DynamoDBRecord;

    if (dynamoRecord.dynamodb?.NewImage && bucketName) {
      const newImage = dynamoRecord.dynamodb.NewImage as Record<
        string,
        AttributeValue
      >;
      const review = unmarshall(newImage);
      logger.info("Unmarshalled review", { review });

      const reviews = await getObjectContent(bucketName, reviewsKey);
      const updatedReviews = `${reviews}\n${JSON.stringify(review)}`;
      logger.info("Updated reviews", { updatedReviews });

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: reviewsKey,
        Body: updatedReviews,
        ContentType: "text/plain",
      });

      try {
        await s3.send(command);
        logger.info("Uploaded review to S3", { review });
      } catch (error) {
        logger.error("Error uploading review to S3", { error });
      }
    }
  }
};
