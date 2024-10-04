import ProductReport from "@/components/ProductReport";
import SentimentReport from "@/components/SentimentReport";

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
      <div className="flex-1 flex flex-col space-y-4">
        <div className="flex-1">
          <SentimentReport />
        </div>
        <div className="flex-1">
          <ProductReport />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
