import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend
  } from "recharts";
  
  const IncidentBarChart = ({ reports, timeframe }) => {
    // Process data based on timeframe
    const getChartData = () => {
      // Group by incident type and count
      const incidentCounts = reports.reduce((acc, report) => {
        acc[report.incidentType] = (acc[report.incidentType] || 0) + 1;
        return acc;
      }, {});
  
      // Convert to array format for the chart
      return Object.keys(incidentCounts).map(type => ({
        type,
        count: incidentCounts[type]
      }));
    };
  
    const chartData = getChartData();
  
    // Custom tooltip to show more information
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
            <p className="font-medium text-gray-900">{`${label}`}</p>
            <p className="text-blue-600">{`${payload[0].value} incidents`}</p>
            <p className="text-xs text-gray-500 mt-1">
              {getTooltipDetails(label)}
            </p>
          </div>
        );
      }
      return null;
    };
  
    // Helper to get additional details for tooltip
    const getTooltipDetails = (incidentType) => {
      // Calculate percentage of this incident type
      const typeCount = reports.filter(r => r.incidentType === incidentType).length;
      const percentage = ((typeCount / reports.length) * 100).toFixed(1);
      return `${percentage}% of all reported incidents`;
    };
  
    return (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="type" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar 
              dataKey="count" 
              name="Number of Incidents" 
              fill="#4F46E5" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default IncidentBarChart;