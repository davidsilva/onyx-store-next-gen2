import { defineBackend } from "@aws-amplify/backend";
import {
  StartingPosition,
  Function as LambdaFunction,
  Runtime as LambdaRuntime,
} from "aws-cdk-lib/aws-lambda";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { Stack } from "aws-cdk-lib";
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { lambdaCodeFromAssetHelper, BuildMode } from "./backend.utils";
import path from "path";
import * as iam from "aws-cdk-lib/aws-iam";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

const dataStack = Stack.of(backend.data);

const productTable = backend.data.resources.tables["Product"];

const stripeProductLambda = new LambdaFunction(
  dataStack,
  "StripeProductLambdaFunction",
  {
    handler: "index.handler",
    code: lambdaCodeFromAssetHelper(
      path.resolve("amplify/functions/stripe-product/handler.ts"),
      { buildMode: BuildMode.Esbuild }
    ),
    runtime: LambdaRuntime.NODEJS_20_X,
    environment: {
      PRODUCT_TABLE_NAME: productTable.tableName,
    },
  }
);

const productTableEventSource = new DynamoEventSource(productTable, {
  startingPosition: StartingPosition.LATEST,
});

stripeProductLambda.addEventSource(productTableEventSource);

stripeProductLambda.role?.attachInlinePolicy(
  new Policy(Stack.of(productTable), "DynamoDBPolicy", {
    statements: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams",
        ],
        resources: [productTable.tableArn],
      }),
    ],
  })
);

const stripeSecureKeyArn = `arn:aws:ssm:${
  Stack.of(stripeProductLambda).region
}:${Stack.of(stripeProductLambda).account}:parameter/stripe/STRIPE_SECURE_KEY`;

stripeProductLambda.role?.attachInlinePolicy(
  new Policy(Stack.of(stripeProductLambda), "SSMPolicy", {
    statements: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["ssm:GetParameter"],
        resources: [stripeSecureKeyArn],
      }),
    ],
  })
);

const reviewTable = backend.data.resources.tables["Review"];
const sentimentCountsTable = backend.data.resources.tables["SentimentCounts"];
const productStatusesTable = backend.data.resources.tables["ProductStatuses"];
const reviewStatusesTable = backend.data.resources.tables["ReviewStatuses"];

const reviewTableEventSource = new DynamoEventSource(reviewTable, {
  startingPosition: StartingPosition.LATEST,
});

const detectReviewSentimentLambda = new LambdaFunction(
  dataStack,
  "DetectReviewSentimentLambdaFunction",
  {
    handler: "index.handler",
    code: lambdaCodeFromAssetHelper(
      path.resolve("amplify/functions/detect-review-sentiment/handler.ts"),
      { buildMode: BuildMode.Esbuild }
    ),
    runtime: LambdaRuntime.NODEJS_20_X,
    environment: {
      REVIEW_TABLE_NAME: reviewTable.tableName,
      SENTIMENT_COUNTS_TABLE_NAME: sentimentCountsTable.tableName,
    },
  }
);

detectReviewSentimentLambda.addEventSource(reviewTableEventSource);

detectReviewSentimentLambda.addToRolePolicy(
  new iam.PolicyStatement({
    actions: [
      "comprehend:DetectSentiment",
      "comprehend:DetectDominantLanguage",
      "comprehend:DetectEntities",
      "comprehend:DetectKeyPhrases",
    ],
    resources: ["*"],
  })
);

detectReviewSentimentLambda.addToRolePolicy(
  new iam.PolicyStatement({
    actions: [
      "dynamodb:GetItem",
      "dynamodb:UpdateItem",
      "dynamodb:DescribeStream",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:ListStreams",
    ],
    resources: [reviewTable.tableArn],
  })
);

const updateSentimentCountsLambda = new LambdaFunction(
  dataStack,
  "UpdateSentimentCountsLambdaFunction",
  {
    handler: "index.handler",
    code: lambdaCodeFromAssetHelper(
      path.resolve("amplify/functions/update-sentiment-counts/handler.ts"),
      { buildMode: BuildMode.Esbuild }
    ),
    runtime: LambdaRuntime.NODEJS_20_X,
    environment: {
      SENTIMENT_COUNTS_TABLE_NAME: sentimentCountsTable.tableName,
    },
  }
);

updateSentimentCountsLambda.addEventSource(reviewTableEventSource);

updateSentimentCountsLambda.addToRolePolicy(
  new iam.PolicyStatement({
    actions: [
      "dynamodb:GetItem",
      "dynamodb:UpdateItem",
      "dynamodb:DescribeStream",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:ListStreams",
    ],
    resources: [reviewTable.tableArn, sentimentCountsTable.tableArn],
  })
);

const generalAggregatesTable =
  backend.data.resources.tables["GeneralAggregates"];

const keepAggregatesLambda = new LambdaFunction(
  dataStack,
  "KeepAggregatesLambdaFunction",
  {
    handler: "index.handler",
    code: lambdaCodeFromAssetHelper(
      path.resolve("amplify/functions/keep-aggregates/handler.ts"),
      { buildMode: BuildMode.Esbuild }
    ),
    runtime: LambdaRuntime.NODEJS_20_X,
    environment: {
      GENERAL_AGGREGATES_TABLE_NAME: generalAggregatesTable.tableName,
      REVIEW_TABLE_NAME: reviewTable.tableName,
      PRODUCT_TABLE_NAME: productTable.tableName,
    },
  }
);

keepAggregatesLambda.addEventSource(reviewTableEventSource);
keepAggregatesLambda.addEventSource(productTableEventSource);

keepAggregatesLambda.addToRolePolicy(
  new iam.PolicyStatement({
    actions: [
      "dynamodb:GetItem",
      "dynamodb:DescribeStream",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:ListStreams",
    ],
    resources: [productTable.tableArn, reviewTable.tableArn],
  })
);

keepAggregatesLambda.addToRolePolicy(
  new iam.PolicyStatement({
    actions: [
      "dynamodb:GetItem",
      "dynamodb:UpdateItem",
      "dynamodb:DescribeStream",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:ListStreams",
    ],
    resources: [generalAggregatesTable.tableArn],
  })
);

const updateStatusesLambda = new LambdaFunction(
  dataStack,
  "UpdateStatusesLambdaFunction",
  {
    handler: "index.handler",
    code: lambdaCodeFromAssetHelper(
      path.resolve("amplify/functions/update-statuses/handler.ts"),
      { buildMode: BuildMode.Esbuild }
    ),
    runtime: LambdaRuntime.NODEJS_20_X,
    environment: {
      PRODUCT_STATUSES_TABLE_NAME: productStatusesTable.tableName,
      PRODUCT_TABLE_NAME: productTable.tableName,
      REVIEW_STATUSES_TABLE_NAME: reviewStatusesTable.tableName,
      REVIEW_TABLE_NAME: reviewTable.tableName,
    },
  }
);

updateStatusesLambda.addEventSource(reviewTableEventSource);
updateStatusesLambda.addEventSource(productTableEventSource);

updateStatusesLambda.addToRolePolicy(
  new iam.PolicyStatement({
    actions: [
      "dynamodb:GetItem",
      "dynamodb:UpdateItem",
      "dynamodb:DescribeStream",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:ListStreams",
    ],
    resources: [
      productTable.tableArn,
      reviewTable.tableArn,
      productStatusesTable.tableArn,
      reviewStatusesTable.tableArn,
    ],
  })
);
