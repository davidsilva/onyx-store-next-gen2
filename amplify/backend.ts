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

const s3Bucket = backend.storage.resources.bucket;

const writeReviewToS3Lambda = new LambdaFunction(
  dataStack,
  "WriteReviewToS3LambdaFunction",
  {
    handler: "index.handler",
    code: lambdaCodeFromAssetHelper(
      path.resolve("amplify/functions/write-review-to-s3/handler.ts"),
      { buildMode: BuildMode.Esbuild }
    ),
    runtime: LambdaRuntime.NODEJS_20_X,
    environment: {
      REVIEW_TABLE_NAME: reviewTable.tableName,
      S3_BUCKET_NAME: s3Bucket.bucketName,
    },
  }
);

const reviewTableEventSource = new DynamoEventSource(reviewTable, {
  startingPosition: StartingPosition.LATEST,
});

writeReviewToS3Lambda.addEventSource(reviewTableEventSource);

writeReviewToS3Lambda.role?.attachInlinePolicy(
  new Policy(Stack.of(reviewTable), "DynamoDBPolicy", {
    statements: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "dynamodb:GetItem",
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams",
        ],
        resources: [reviewTable.tableArn],
      }),
    ],
  })
);

writeReviewToS3Lambda.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ["s3:GetObject", "s3:PutObject", "s3:ListBucket"], // For ListBucket action
    resources: [`${s3Bucket.bucketArn}`, `${s3Bucket.bucketArn}/reviews/*`], // For GetObject and PutObject actions
  })
);
