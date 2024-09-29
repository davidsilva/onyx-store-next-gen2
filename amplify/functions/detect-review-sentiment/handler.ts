import {
  AttributeValue,
  DynamoDBClient,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import type { DynamoDBRecord, DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import {
  ComprehendClient,
  DetectDominantLanguageCommand,
  DetectSentimentCommand,
  LanguageCode,
  DetectSentimentCommandOutput,
  DetectSentimentResponse,
} from "@aws-sdk/client-comprehend";
const logger = new Logger({
  logLevel: "INFO",
  serviceName: "dynamodb-stream-handler",
});

const comprehendClient = new ComprehendClient({});
const dynamoDBClient = new DynamoDBClient({ region: process.env.AWS_REGION });

const detectLanguage = async (text: string): Promise<LanguageCode | null> => {
  const detectDominantLanguageCommand = new DetectDominantLanguageCommand({
    Text: text,
  });

  try {
    const response = await comprehendClient.send(detectDominantLanguageCommand);
    const Languages = response.Languages;
    if (!Languages || Languages.length === 0) {
      throw new Error("No languages detected");
    }
    return Languages[0].LanguageCode as LanguageCode;
  } catch (error) {
    logger.error("Error detecting language", { error });
    return null;
  }
};

const detectSentiment = async (
  text: string,
  languageCode: LanguageCode
): Promise<DetectSentimentResponse | null> => {
  const params = {
    Text: text,
    LanguageCode: languageCode,
  };
  const command = new DetectSentimentCommand(params);

  try {
    const response = await comprehendClient.send(command);
    return response;
  } catch (error) {
    logger.error("Error detecting sentiment", { error });
    return null;
  }
};

const updateReview = async (
  review: any,
  sentiment: DetectSentimentResponse,
  languageCode: string
) => {
  if (sentiment && sentiment.Sentiment && sentiment.SentimentScore) {
    // Update the review with the sentiment
    const mixedScore = sentiment.SentimentScore.Mixed ?? 0;
    const negativeScore = sentiment.SentimentScore.Negative ?? 0;
    const neutralScore = sentiment.SentimentScore.Neutral ?? 0;
    const positiveScore = sentiment.SentimentScore.Positive ?? 0;

    const updateParams = {
      TableName: process.env.REVIEW_TABLE_NAME,
      Key: marshall({
        id: review.id,
      }),
      UpdateExpression:
        "SET sentiment = :sentiment, sentimentScoreMixed = :mixed, sentimentScoreNegative = :negative, sentimentScoreNeutral = :neutral, sentimentScorePositive = :positive, languageCode = :languageCode",
      ExpressionAttributeValues: {
        ":sentiment": { S: sentiment?.Sentiment },
        ":mixed": { N: mixedScore.toString() },
        ":negative": { N: negativeScore.toString() },
        ":neutral": { N: neutralScore.toString() },
        ":positive": { N: positiveScore.toString() },
        ":languageCode": { S: languageCode },
      },
    };

    try {
      await dynamoDBClient.send(new UpdateItemCommand(updateParams));
      logger.info("Updated review with sentiment analysis result");
    } catch (error) {
      logger.error("Error updating review", { error });
    }
  }
};

export const handler: DynamoDBStreamHandler = async (event) => {
  logger.info("Received event", { event });

  for (const record of event.Records) {
    logger.info("Processing record", { record });

    if (record.eventName !== "INSERT" && record.eventName !== "MODIFY") {
      continue;
    }

    const dynamoRecord = record as DynamoDBRecord;

    if (dynamoRecord.dynamodb?.NewImage) {
      const newImage = dynamoRecord.dynamodb.NewImage as Record<
        string,
        AttributeValue
      >;
      const review = unmarshall(newImage);
      logger.info("Unmarshalled review", { review });

      try {
        const reviewText = `${review.title} ${review.content}`;

        // Get the language using AWS Comprehend
        const languageCode = await detectLanguage(reviewText);
        logger.info("Detected language", { languageCode });

        if (languageCode) {
          // Get the sentiment using AWS Comprehend
          const sentiment = await detectSentiment(reviewText, languageCode);
          logger.info(
            `Sentiment analysis result: ${
              JSON.stringify(sentiment) || "No sentiment detected"
            }`
          );
          if (sentiment) {
            await updateReview(review, sentiment, languageCode);
          }
        } else {
          logger.warn("No language detected. Skipping sentiment detection");
        }
      } catch (error) {
        logger.error("Error getting language and sentiment", { error });
      }
    }
  }
};
