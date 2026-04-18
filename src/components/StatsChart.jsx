import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const StatsChart = ({ data }) => {
  const chartData = [
    { name: "Pending", value: data.pendingDocs },
    { name: "Approved", value: data.approvedDocs },
    { name: "Rejected", value: data.rejectedDocs }
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">
        Documents Status 📊
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;