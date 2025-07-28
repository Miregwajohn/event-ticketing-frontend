import React from "react";
import { useGetSalesReportQuery } from "../../features/api/salesApi";
import { Button } from "../../component/ui/button";
import { Download } from "lucide-react";

const SalesReport: React.FC = () => {
  const { data, error, isLoading } = useGetSalesReportQuery();

  const BASE_URL = "http://localhost:5000/api/sales"; // Change if hosted

  const handleDownload = (type: "csv" | "pdf") => {
    window.open(`${BASE_URL}/report/${type}`, "_blank");
  };

  if (isLoading) return <p>Loading sales report...</p>;
  if (error || !data) return <p className="text-red-500">Error loading report.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Sales Report</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-xl font-bold text-green-600">KES {data.totalRevenue}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
          <h3 className="text-lg font-semibold">Total Bookings</h3>
          <p className="text-xl font-bold">{data.totalBookings}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
          <h3 className="text-lg font-semibold">Top Events</h3>
          <ul className="list-disc pl-4">
            {data.topEvents.map((event: any, i: number) => (
              <li key={i}>
                {event.title} ({event.ticketsSold} sold)
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={() => handleDownload("csv")}
        >
          <Download size={16} /> Download CSV
        </Button>
        <Button
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
          onClick={() => handleDownload("pdf")}
        >
          <Download size={16} /> Download PDF
        </Button>
      </div>
    </div>
  );
};

export default SalesReport;
