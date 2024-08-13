import { defineBackend } from "@aws-amplify/backend";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { createStripeProductFunction } from "./data/resource";
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  createStripeProductFunction,
});

const eventSource = new DynamoEventSource(
  backend.data.resources.tables["Product"],
  {
    startingPosition: StartingPosition.LATEST,
  }
);

backend.createStripeProductFunction.resources.lambda.addEventSource(
  eventSource
);
