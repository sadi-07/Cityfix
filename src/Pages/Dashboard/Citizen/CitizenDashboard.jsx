import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CitizenDashboard = () => {
  const { user } = useContext(AuthContext);
  const backend = "https://city-fix-server-one.vercel.app";

  // ================= FETCH DATA =================
  const { data: issues = [], isLoading: loadingIssues } = useQuery({
    queryKey: ["citizenIssues", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await fetch(`${backend}/issues?email=${user.email}`);
      return res.json();
    },
    enabled: !!user?.email,
  });

  const { data: payments = [], isLoading: loadingPayments } = useQuery({
    queryKey: ["citizenPayments", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      
      const res = await fetch(`${backend}/payments?email=${user.email}`);
      return res.json();
    },
    enabled: !!user?.email,
  });

  if (loadingIssues || loadingPayments) {
    return <p className="text-lg">Loading dashboard...</p>;
  }

  // ================= CALCULATIONS =================
  const totalIssues = issues.length;
  const pendingIssues = issues.filter(i => i.status === "Pending").length;
  const inProgressIssues = issues.filter(
    i => i.status === "In-progress" || i.status === "In-Progress"
  ).length;
  const resolvedIssues = issues.filter(i => i.status === "Closed").length;

  const totalPayments = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  const successRate =
    totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

  // ================= CARD STATS =================
  const stats = [
    { title: "Total Issues", value: totalIssues, color: "bg-blue-600" },
    { title: "Pending Issues", value: pendingIssues, color: "bg-yellow-500" },
    { title: "In-Progress Issues", value: inProgressIssues, color: "bg-purple-600" },
    { title: "Resolved Issues", value: resolvedIssues, color: "bg-green-600" },
    { title: "Total Payments (৳)", value: totalPayments, color: "bg-red-600" },
    { title: "Success Rate", value: `${successRate}%`, color: "bg-indigo-600" },
  ];

  // ================= CHART DATA =================
  const issueChartData = [
    { name: "Pending", value: pendingIssues },
    { name: "In-Progress", value: inProgressIssues },
    { name: "Resolved", value: resolvedIssues },
  ];

  const pieColors = ["#facc15", "#9333ea", "#22c55e"];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Citizen Dashboard</h2>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map(stat => (
          <div
            key={stat.title}
            className={`p-6 rounded shadow text-white ${stat.color}`}
          >
            <h3 className="text-lg opacity-90">{stat.title}</h3>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Issues Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={issueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">
            Issue Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={issueChartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {issueChartData.map((_, index) => (
                    <Cell key={index} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {user?.blocked && (
        <p className="text-red-600 font-semibold">
          Your account is blocked. You cannot submit, edit, upvote, or boost issues.
        </p>
      )}
    </div>
  );
};

export default CitizenDashboard;
