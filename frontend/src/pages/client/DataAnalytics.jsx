import { useState } from "react";
import IncidentBarChart from "./IncidentBarChart";
import IncidentPieChart from "./IncidentPieChart";
import GeoHeatmap from "./GeoHeatmap";
import TimeBasedTrends from "./TimeBasedTrends";

const DataAnalytics = ({ reports }) => {
  const [timeframe, setTimeframe] = useState("monthly");
  const [exportFormat, setExportFormat] = useState("pdf");
  return (
    <div className="space-y-6">
      {/* Header section with controls */}
      <div className="bg-white p-6 shadow rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-700">
              Data Analytics Center
            </h2>
            <p className="text-gray-500 mt-1">
              Gain insights into driver behavior and trends
            </p>
          </div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Types Breakdown */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Incidents Breakdown
          </h3>
          <IncidentBarChart reports={reports} timeframe={timeframe} />
        </div>

        {/* Incident Distribution */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Incident Distribution
          </h3>
          <IncidentPieChart reports={reports} />
        </div>

        {/* Geographic Heatmap */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Geographic Distribution
          </h3>
          <GeoHeatmap reports={reports} />
        </div>

        {/* Time-based Trends */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Time-based Trends
          </h3>
          <TimeBasedTrends reports={reports} timeframe={timeframe} />
        </div>
      </div>

    </div>
  );
};

export default DataAnalytics;
