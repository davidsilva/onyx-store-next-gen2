import { defineFunction } from "@aws-amplify/backend";

export const writeReviewToS3Lambda = defineFunction({
  name: "write-review-to-s3",
});
