import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const TimeBasedTrends = ({ reports, timeframe }) => {
  const [selectedTypes, setSelectedTypes] = useState(["all"]);

  // Process data based on timeframe and selected incident types
  const getChartData = () => {
    // Group reports by time period based on the selected timeframe
    const groupedData = {};
    
    reports.forEach(report => {
      const date = new Date(report.date);
      let key;
      
      switch(timeframe) {
        case 'daily':
          key = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'weekly':
          // Get the week number
          const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
          const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
          const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
          key = `${date.getFullYear()}-W${weekNum}`;
          break;
        case 'yearly':
          key = date.getFullYear().toString();
          break;
        case 'monthly':
        default:
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
      }
      
      if (!groupedData[key]) {
        groupedData[key] = {
          period: key,
          all: 0
        };
      }
      
      groupedData[key].all += 1;
      
      // Also track by incident type
      if (!groupedData[key][report.incidentType]) {
        groupedData[key][report.incidentType] = 0;
      }
      groupedData[key][report.incidentType] += 1;
    });
    
    // Convert to array and sort by period
    return Object.values(groupedData).sort((a, b) => a.period.localeCompare(b.period));
  };

  const chartData = getChartData();
  
  // Get all incident types for filter options
  const getIncidentTypes = () => {
    const types = new Set();
    reports.forEach(report => {
      types.add(report.incidentType);
    });
    return Array.from(types);
  };
  
  const incidentTypes = getIncidentTypes();
  
  // Handle incident type selection
  const toggleIncidentType = (type) => {
    if (type === "all") {
      setSelectedTypes(["all"]);
      return;
    }
    
    const newSelection = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes.filter(t => t !== "all"), type];
      
    if (newSelection.length === 0) {
      setSelectedTypes(["all"]);
    } else {
      setSelectedTypes(newSelection);
    }
  };
  
  // Get colors for each line
  const getLineColor = (type) => {
    const colors = {
      all: "#4F46E5",
      "Speeding": "#EF4444",
      "Running Red Light": "#F59E0B",
      "Reckless Driving": "#10B981",
      "Tailgating": "#8B5CF6",
      "Other": "#6B7280"
    };
    return colors[type] || "#6B7280";
  };
  
  // Format the x-axis labels based on timeframe
  const formatXAxisTick = (value) => {
    switch(timeframe) {
      case 'daily':
        // For daily, show just the day number
        return value.split('-')[2];
      case 'weekly':
        // For weekly, show "W" + week number
        return `W${value.split('W')[1]}`;
      case 'yearly':
        // For yearly, show the full year
        return value;
      case 'monthly':
      default:
        // For monthly, show month abbreviation
        const [year, month] = value.split('-');
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleString('default', { month: 'short' });
    }
  };

  return (
    <div>
      {/* Incident type filter buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => toggleIncidentType("all")}
          className={`px-3 py-1 text-xs rounded-full transition ${
            selectedTypes.includes("all")
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All Incidents
        </button>
        
        {incidentTypes.map(type => (
          <button
            key={type}
            onClick={() => toggleIncidentType(type)}
            className={`px-3 py-1 text-xs rounded-full transition ${
              selectedTypes.includes(type) && !selectedTypes.includes("all")
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      
      {/* Line chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 12 }}
              tickFormatter={formatXAxisTick}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            
            {/* Render selected lines */}
            {selectedTypes.includes("all") ? (
              <Line
                type="monotone"
                dataKey="all"
                name="All Incidents"
                stroke={getLineColor("all")}
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            ) : (
              selectedTypes.map(type => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  name={type}
                  stroke={getLineColor(type)}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              ))
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Trend analysis */}
      <div className="mt-4 text-xs text-gray-600">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Trends show how incident reports change over time. Use the filters above to compare specific incident types.
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimeBasedTrends;