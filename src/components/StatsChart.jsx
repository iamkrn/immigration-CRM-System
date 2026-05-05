import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

const StatsChart = ({ data, isDark }) => {
  const chartData = [
    { name: "Pending", value: data.pendingDocs || 0 },
    { name: "Approved", value: data.approvedDocs || 0 },
    { name: "Rejected", value: data.rejectedDocs || 0 }
  ];

  // Simulated data for line chart (showing trends over months)
  const trendData = [
    { month: "Jan", documents: 12, applications: 8 },
    { month: "Feb", documents: 19, applications: 12 },
    { month: "Mar", documents: 15, applications: 18 },
    { month: "Apr", documents: 25, applications: 22 },
    { month: "May", documents: 22, applications: 28 },
    { month: "Jun", documents: 30, applications: 35 }
  ];

  const COLORS = {
    pie: ["#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6", "#EC4899"],
    bar: ["#3B82F6", "#10B981", "#EF4444"],
    line: {
      documents: "#3B82F6",
      applications: "#10B981"
    }
  };

  const textColor = isDark ? "#E5E7EB" : "#374151";
  const gridColor = isDark ? "#4B5563" : "#E5E7EB";
  const bgColor = isDark ? "#1F2937" : "#FFFFFF";

  return (
    <div className="space-y-8">
      {/* Bar Chart - Documents Status */}
      <div className={`rounded-2xl shadow-lg p-8 ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <div className="mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            📊 Documents Status
          </h2>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Overview of document statuses
          </p>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: bgColor,
                border: `1px solid ${gridColor}`,
                borderRadius: "8px"
              }}
              labelStyle={{ color: textColor }}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            <Bar dataKey="value" fill="#3B82F6" name="Count" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Grid for Pie and Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className={`rounded-2xl shadow-lg p-8 ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <div className="mb-6">
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
              🥧 Distribution
            </h2>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Document status distribution
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.pie[index % COLORS.pie.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: bgColor,
                  border: `1px solid ${gridColor}`,
                  borderRadius: "8px"
                }}
                labelStyle={{ color: textColor }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics Summary */}
        <div className={`rounded-2xl shadow-lg p-8 ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <div className="mb-6">
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
              📈 Quick Stats
            </h2>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Document metrics summary
            </p>
          </div>

          <div className="space-y-4">
            <StatItem
              label="Pending"
              value={data.pendingDocs || 0}
              color="bg-blue-500"
              isDark={isDark}
              total={(data.pendingDocs || 0) + (data.approvedDocs || 0) + (data.rejectedDocs || 0)}
            />
            <StatItem
              label="Approved"
              value={data.approvedDocs || 0}
              color="bg-green-500"
              isDark={isDark}
              total={(data.pendingDocs || 0) + (data.approvedDocs || 0) + (data.rejectedDocs || 0)}
            />
            <StatItem
              label="Rejected"
              value={data.rejectedDocs || 0}
              color="bg-red-500"
              isDark={isDark}
              total={(data.pendingDocs || 0) + (data.approvedDocs || 0) + (data.rejectedDocs || 0)}
            />
            <div className={`pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex justify-between items-center">
                <span className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Total Documents
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {(data.pendingDocs || 0) + (data.approvedDocs || 0) + (data.rejectedDocs || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line Chart - Trends */}
      <div className={`rounded-2xl shadow-lg p-8 ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <div className="mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            📉 Monthly Trends
          </h2>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Documents and applications over time
          </p>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: bgColor,
                border: `1px solid ${gridColor}`,
                borderRadius: "8px"
              }}
              labelStyle={{ color: textColor }}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            <Line
              type="monotone"
              dataKey="documents"
              stroke={COLORS.line.documents}
              strokeWidth={3}
              dot={{ fill: COLORS.line.documents, r: 5 }}
              activeDot={{ r: 7 }}
              name="Documents"
            />
            <Line
              type="monotone"
              dataKey="applications"
              stroke={COLORS.line.applications}
              strokeWidth={3}
              dot={{ fill: COLORS.line.applications, r: 5 }}
              activeDot={{ r: 7 }}
              name="Applications"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, color, isDark, total }) => {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`${color} rounded-lg p-3 text-white font-bold text-sm`}>
          {value}
        </div>
        <span className={isDark ? "text-gray-300" : "text-gray-700"}>{label}</span>
      </div>
      <div className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {percentage}%
      </div>
    </div>
  );
};

export default StatsChart;