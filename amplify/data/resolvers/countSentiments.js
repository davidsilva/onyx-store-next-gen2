/**
 * Generates a request for counting the number of sentiments in Reviews table in DynamoDB. Datasource is the Reviews table.
 *
 * @param {Object} ctx - The context object provided by AppSync.
 * @returns {Object} The request object for the DynamoDB Scan operation.
 */
export function request(ctx) {
  return {
    operation: "Scan",
    projection: {
      expression: "#sentiment",
      expressionNames: {
        "#sentiment": "sentiment",
      },
    },
  };
}

/**
 * Processes the response from the DynamoDB Scan operation.
 *
 * @param {Object} ctx - The context object provided by AppSync.
 * @returns {Object} The processed response with sentiment counts.
 */
export function response(ctx) {
  const sentiments = ctx.result.items.map((item) => item.sentiment);
  const sentimentCounts = sentiments.reduce((counts, sentiment) => {
    counts[sentiment] = (counts[sentiment] || 0) + 1;
    return counts;
  }, {});
  return sentimentCounts;
}
