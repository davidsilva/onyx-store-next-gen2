import { util } from "@aws-appsync/utils";

/**
 * Generates a request for updating a product's isArchived property in DynamoDB.
 *
 * @param {Object} ctx - The context object provided by AppSync.
 * @param {Object} ctx.args - The arguments passed to the resolver.
 * @param {string} ctx.args.productId - The ID of the product to be updated.
 * @param {boolean} ctx.args.archive - Flag indicating whether to archive or restore the product. True means archive, false means restore. Default is true.
 * @returns {Object} The request object for the DynamoDB UpdateItem operation.
 */
export function request(ctx) {
  const { archive = true } = ctx.args;
  return {
    operation: "UpdateItem",
    key: util.dynamodb.toMapValues({
      id: ctx.args.productId,
    }),
    update: {
      expression: "SET isArchived = :isArchived",
      expressionValues: util.dynamodb.toMapValues({
        ":isArchived": archive,
      }),
    },
  };
}

/**
 * Processes the response from the DynamoDB UpdateItem operation.
 *
 * @param {Object} ctx - The context object provided by AppSync.
 * @returns {Object} The processed response.
 */
export function response(ctx) {
  console.log("archiveProduct response ctx", ctx);
  return ctx.result;
}
