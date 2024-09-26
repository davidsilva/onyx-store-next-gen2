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

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

const productTable = backend.data.resources.tables["Product"];

const reviewTable = backend.data.resources.tables["Review"];

const dataStack = Stack.of(backend.data);

const stripeProductLambda = new LambdaFunction(dataStack, "MyCustomFunction", {
  handler: "index.handler",
  code: lambdaCodeFromAssetHelper(
    path.resolve("amplify/functions/stripe-product/handler.ts"),
    { buildMode: BuildMode.Esbuild }
  ),
  runtime: LambdaRuntime.NODEJS_20_X,
  environment: {
    PRODUCT_TABLE_NAME: productTable.tableName,
  },
});

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
