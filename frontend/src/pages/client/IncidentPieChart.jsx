import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const IncidentPieChart = ({ reports }) => {
  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  // Process data for the pie chart
  const getChartData = () => {
    // Group by incident type and count
    const incidentCounts = reports.reduce((acc, report) => {
      acc[report.incidentType] = (acc[report.incidentType] || 0) + 1;
      return acc;
    }, {});

    // Convert to array format for the chart
    return Object.keys(incidentCounts).map(type => ({
      name: type,
      value: incidentCounts[type]
    }));
  };

  const chartData = getChartData();

  // Calculate percentages for the custom tooltip
  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-gray-600">{`${data.value} incidents (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend that shows percentages
  const CustomLegend = ({ payload }) => {
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => {
          const percentage = ((entry.payload.value / total) * 100).toFixed(1);
          return (
            <li key={`item-${index}`} className="flex items-center">
              <div
                className="w-3 h-3 mr-2"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-xs text-gray-700">
                {entry.value} ({percentage}%)
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncidentPieChart;