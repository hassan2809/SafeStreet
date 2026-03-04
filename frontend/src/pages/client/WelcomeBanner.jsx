import { useState, useEffect } from "react";

const WelcomeBanner = () => {
  const [clientInfo, setClientInfo] = useState({
    name: "",
    subscriptionStatus: "",
    subscriptionExpiry: "",
  });

  const [stats, setStats] = useState({
    totalReportsAccessed: 0,
    creditBalance: 0,
  });

  useEffect(() => {
    // In a real application, this would fetch from an API
    // Mocking data for demonstration
    setClientInfo({
      name: "SafeInsure Co.",
      subscriptionStatus: "Premium",
      subscriptionExpiry: "2025-12-31",
    });

    setStats({
      totalReportsAccessed: 48,
      creditBalance: 500,
    });
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "premium":
        return "bg-green-100 text-green-800";
      case "standard":
        return "bg-blue-100 text-blue-800";
      case "basic":
        return "bg-gray-100 text-gray-800";
      case "trial":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
      {/* Left Side - Welcome Message */}
      <div className="mb-4 md:mb-0">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {clientInfo.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Access real-time driver risk data and analytics
        </p>
      </div>
    </div>
  );
};

export default WelcomeBanner;
