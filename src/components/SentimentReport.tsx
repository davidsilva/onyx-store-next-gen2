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
import { PieChart, Pie } from "recharts";

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

const SentimentReport = ({ className }: { className?: string }) => {
  const [sentimentQueryResult, setSentimentQueryResult] =
    useState<CountReviewSentimentsReturnType | null>(null);
  const [sentimentTrackingTable, setSentimentTrackingTable] = useState<
    SentimentCountsType[] | null
  >(defaultSentimentCounts);
  const [reviewCount, setReviewCount] = useState(0);

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

  useEffect(() => {
    const fetchCounts = async () => {
      const result = await client.models.GeneralAggregates.list({
        selectionSet: ["entityType", "count"],
      });
      console.log("GeneralAggregates list", result);
      if (result.data && result.data.length > 0) {
        const reviewAggregate = result.data.find(
          (item) => item.entityType === "Review"
        );
        setReviewCount(reviewAggregate ? reviewAggregate.count : 0);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    console.log("sentimentTrackingTable", sentimentTrackingTable);
  }, [sentimentTrackingTable]);

  const renderPieChart = () => {
    // Change sentimentTrackingTable to data an array of objects with name and value
    const chartData = sentimentTrackingTable?.map((item) => ({
      name: item.sentiment,
      value: item.count,
    }));

    if (sentimentTrackingTable?.length === 0) {
      return <p>No data available.</p>;
    }

    return (
      <div className="w-full h-full flex justify-center items-center">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, value }) => `${name} (${value})`}
          />
        </PieChart>
      </div>
    );
  };

  return (
    <div className={className}>
      <Flex className="gap-4">
        <Card variation="outlined" className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Total Reviews: {reviewCount}
          </h3>
        </Card>
        <div className="flex-1 w-52">
          <Card variation="outlined" className="mb-3 w-52">
            {renderPieChart()}
            {/* Seems to be a problem with using ResponsiveContainer in React 18+ 
            <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={sentimentTrackingTable || []}
              dataKey="count"
              nameKey="sentiment"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {sentimentTrackingTable?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer> */}
          </Card>
        </div>
        {sentimentQueryResult && (
          <Card variation="outlined" className="mb-6">
            <Table caption="AppSync JavaScript Resolver">
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
    </div>
  );
};

export default SentimentReport;
