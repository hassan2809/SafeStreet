import { useState, useEffect } from "react";
import { TrendingUp, ImageIcon, ClipboardCheck } from "lucide-react";
import AdminOverViewCards from "../../components/adminOverViewCards/AdminOverViewCards";
import { getUsersSignup } from "../../api/userService";
import { getTotalReports } from "../../api/reportService";
import { getAllMediaStats } from "../../api/mediaRequestService";

const OverviewDashboard = () => {
  // Revenue Data
  const revenueData = [
    { month: "Jan", amount: 15420 },
    { month: "Feb", amount: 18250 },
    { month: "Mar", amount: 17840 },
    { month: "Apr", amount: 19220 },
    { month: "May", amount: 21450 },
    { month: "Jun", amount: 24598 },
  ];
  const maxAmount = Math.max(...revenueData.map((item) => item.amount));

  const [metrics, setMetrics] = useState({
    newSignups: { daily: 0, weekly: 0, monthly: 0, lastMonth: 0 },
    reportsSubmitted: { daily: 0, weekly: 0, monthly: 0, lastMonth: 0 },
    mediaRequests: { daily: 0, weekly: 0, monthly: 0, lastMonth: 0 },
    revenueMetrics: { media: 0, advertising: 0, total: 0 }, // ✅ Added revenueMetrics
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [newSignups, reportsSubmitted, mediaRequests] = await Promise.allSettled([
          getUsersSignup(),
          getTotalReports(),
          getAllMediaStats(),
        ]);

        // ✅ Handle failed API calls gracefully
        setMetrics({
          newSignups: newSignups.status === "fulfilled" ? newSignups.value : metrics.newSignups,
          reportsSubmitted: reportsSubmitted.status === "fulfilled" ? reportsSubmitted.value : metrics.reportsSubmitted,
          mediaRequests: mediaRequests.status === "fulfilled" ? mediaRequests.value : metrics.mediaRequests,
          revenueMetrics: {
            media: 4500, // Example static value (Replace with API later)
            advertising: 3200,
            total: 7700,
          },
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const calculateChange = (current, lastMonth) =>
    lastMonth ? (((current - lastMonth) / lastMonth) * 100).toFixed(2) : 0;

  const changes = {
    newSignups: {
      value: calculateChange(metrics.newSignups.monthly, metrics.newSignups.lastMonth),
      positive: metrics.newSignups.monthly >= metrics.newSignups.lastMonth,
    },
    reportsSubmitted: {
      value: calculateChange(metrics.reportsSubmitted.monthly, metrics.reportsSubmitted.lastMonth),
      positive: metrics.reportsSubmitted.monthly >= metrics.reportsSubmitted.lastMonth,
    },
    mediaRequests: {
      value: calculateChange(metrics.mediaRequests.monthly, metrics.mediaRequests.lastMonth),
      positive: metrics.mediaRequests.monthly >= metrics.mediaRequests.lastMonth,
    },
    revenue: {
      value: 5.2, // Example static revenue percentage change
      positive: true,
    },
  };
  // console.log(changes);

  if (loading) return <div className="p-6 text-center text-gray-600">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AdminOverViewCards title="New Signups" metric={metrics.newSignups} changes={changes.newSignups} icon={<TrendingUp className="w-6 h-6 text-green-600" />} />
        <AdminOverViewCards title="Reports Submitted" metric={metrics.reportsSubmitted} changes={changes.reportsSubmitted} icon={<ClipboardCheck className="w-6 h-6 text-green-600" />} />
        <AdminOverViewCards title="Media Requests" metric={metrics.mediaRequests} changes={changes.mediaRequests} icon={<ImageIcon className="w-6 h-6 text-green-600" />} />
      </div>

      {/* Revenue Overview Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Revenue Overview</h2>
        <p className="text-gray-500">Monthly revenue performance metrics</p>
      </div>

      {/* Revenue and Trend Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Breakdown */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
            <div className="space-y-4">
              {/* Media Requests Revenue */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-600">Media Requests</span>
                  <span className="text-gray-800 font-medium">${metrics.revenueMetrics.media.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(metrics.revenueMetrics.media / metrics.revenueMetrics.total) * 100}%` }}></div>
                </div>
              </div>

              {/* Advertising Revenue */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-600">Advertising</span>
                  <span className="text-gray-800 font-medium">${metrics.revenueMetrics.advertising.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(metrics.revenueMetrics.advertising / metrics.revenueMetrics.total) * 100}%` }}></div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="pt-4 mt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Revenue</span>
                  <span className="text-gray-800 font-bold">${metrics.revenueMetrics.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Trend Chart */}
        <div className="lg:col-span-2 hidden">
          <div className="bg-white rounded-lg shadow p-6 h-full">
            <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
            <div className="flex items-end h-64 space-x-2 mt-8">
              {revenueData.map((item) => {
                const heightPercent = (item.amount / maxAmount) * 80;
                return (
                  <div key={item.month} className="flex flex-col items-center flex-1">
                    <div className="bg-blue-500 w-full rounded-t min-h-2" style={{ height: `${heightPercent}%` }}></div>
                    <p className="text-xs font-medium mt-2">{item.month}</p>
                    <p className="text-xs text-gray-500">${(item.amount / 1000).toFixed(1)}k</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;