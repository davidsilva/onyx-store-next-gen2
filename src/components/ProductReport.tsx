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

type ProductStatusReturnType = Schema["ProductStatuses"]["type"];

const client = generateClient<Schema>({ authMode: "userPool" });

const defaultProductStatusCounts: ProductStatusReturnType[] = [
  { status: "ACTIVE", count: 0 },
  { status: "ARCHIVED", count: 0 },
  { status: "PENDING", count: 0 },
];

const mergeProductStatusCounts = (
  defaultCounts: ProductStatusReturnType[],
  apiCounts: ProductStatusReturnType[]
) => {
  const countsMap = new Map(
    defaultCounts.map((item) => [item.status, item.count])
  );
  apiCounts.forEach((item) => countsMap.set(item.status, item.count));
  return Array.from(countsMap, ([status, count]) => ({ status, count }));
};

const ProductReport = ({ className }: { className?: string }) => {
  const [productStatusTrackingTable, setProductStatusTrackingTable] = useState<
    ProductStatusReturnType[] | null
  >(defaultProductStatusCounts);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchProductStatusTrackingTable = async () => {
      const result = await client.models.ProductStatuses.list({
        selectionSet: ["status", "count"],
      });
      console.log("product status tracking table", result);
      if (result.data && result.data.length > 0) {
        const mergedCounts = mergeProductStatusCounts(
          defaultProductStatusCounts,
          result.data
        );
        setProductStatusTrackingTable(mergedCounts);
      }
    };

    fetchProductStatusTrackingTable();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      const result = await client.models.GeneralAggregates.list({
        selectionSet: ["entityType", "count"],
      });
      console.log("GeneralAggregates list", result);
      if (result.data && result.data.length > 0) {
        const productAggregate = result.data.find(
          (item) => item.entityType === "Product"
        );
        setProductCount(productAggregate ? productAggregate.count : 0);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    console.log("productStatusTrackingTable", productStatusTrackingTable);
  }, [productStatusTrackingTable]);

  const renderPieChart = () => {
    // Change productStatusTrackingTable to data an array of objects with name and value
    const chartData = productStatusTrackingTable?.map((item) => ({
      name: item.status,
      value: item.count,
    }));

    if (productStatusTrackingTable?.length === 0) {
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
            Total Products: {productCount}
          </h3>
          <Table caption="Product Status">
            <TableHead>
              <TableRow>
                <TableCell as="th">Status</TableCell>
                <TableCell as="th">Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productStatusTrackingTable?.map(({ status, count }) => (
                <TableRow key={status}>
                  <TableCell as="th">{status}</TableCell>
                  <TableCell>{count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <div className="flex-1 w-52">
          <Card variation="outlined" className="mb-3 w-52">
            {renderPieChart()}
          </Card>
        </div>
      </Flex>
    </div>
  );
};

export default ProductReport;
