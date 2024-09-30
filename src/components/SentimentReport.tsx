"use client";

import { generateClient } from "@aws-amplify/api";
import { type Schema } from "@/../amplify/data/resource";
import { useEffect } from "react";

const client = generateClient<Schema>({ authMode: "userPool" });

const SentimentReport = () => {
  useEffect(() => {
    const fetchSentimentReport = async () => {
      const result = await client.queries.countReviewSentiments();
      console.log(result);
    };

    fetchSentimentReport();
  }, []);

  return <div>Sentiment Report</div>;
};

export default SentimentReport;
