"use client";

import { generateClient } from "@aws-amplify/api";
import { type Schema } from "@/../amplify/data/resource";
import { useEffect, useState } from "react";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Card,
  Flex,
} from "@aws-amplify/ui-react";

type CountReviewSentimentsReturnType = Schema["SentimentCountsType"]["type"];
type SentimentCountsType = Pick<
  Schema["SentimentCounts"]["type"],
  "sentiment" | "count"
>;

const client = generateClient<Schema>({ authMode: "userPool" });

const defaultSentimentCounts: SentimentCountsType[] = [
  { sentiment: "POSITIVE", count: 0 },
  { sentiment: "NEGATIVE", count: 0 },
  { sentiment: "NEUTRAL", count: 0 },
  { sentiment: "MIXED", count: 0 },
];

const mergeSentimentCounts = (
  defaultCounts: SentimentCountsType[],
  apiCounts: SentimentCountsType[]
) => {
  const countsMap = new Map(
    defaultCounts.map((item) => [item.sentiment, item.count])
  );
  apiCounts.forEach((item) => countsMap.set(item.sentiment, item.count));
  return Array.from(countsMap, ([sentiment, count]) => ({ sentiment, count }));
};

const SentimentReport = () => {
  const [sentimentQueryResult, setSentimentQueryResult] =
    useState<CountReviewSentimentsReturnType | null>(null);
  const [sentimentTrackingTable, setSentimentTrackingTable] = useState<
    SentimentCountsType[] | null
  >(defaultSentimentCounts);

  useEffect(() => {
    const fetchSentimentReport = async () => {
      const result = await client.queries.countReviewSentiments();
      console.log("sentiment report", result);
      if (result.data) {
        setSentimentQueryResult(result.data);
      }
    };

    fetchSentimentReport();
  }, []);

  useEffect(() => {
    const fetchSentimentTrackingTable = async () => {
      const result = await client.models.SentimentCounts.list({
        selectionSet: ["sentiment", "count"],
      });
      console.log("sentiment tracking table", result);
      if (result.data && result.data.length > 0) {
        const mergedCounts = mergeSentimentCounts(
          defaultSentimentCounts,
          result.data
        );
        setSentimentTrackingTable(mergedCounts);
      }
    };

    fetchSentimentTrackingTable();
  }, []);

  return (
    <Flex className="gap-4">
      {sentimentQueryResult && (
        <Card variation="outlined" className="mb-6">
          <Table caption="Result from AppSync JavaScript Resolver">
            <TableHead>
              <TableRow>
                <TableCell as="th">Sentiment</TableCell>
                <TableCell as="th">Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(sentimentQueryResult).map(
                ([sentiment, count]) => (
                  <TableRow key={sentiment}>
                    <TableCell as="th">{sentiment}</TableCell>
                    <TableCell>{count ?? 0}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      <Card variation="outlined" className="mb-6">
        <Table caption="Sentiment Tracking Table">
          <TableHead>
            <TableRow>
              <TableCell as="th">Sentiment</TableCell>
              <TableCell as="th">Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sentimentTrackingTable?.map(({ sentiment, count }) => (
              <TableRow key={sentiment}>
                <TableCell as="th">{sentiment}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Flex>
  );
};

export default SentimentReport;
