import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CitizenDashboard = () => {
  const { user } = useContext(AuthContext);
  const backend = "http://localhost:3000";

  const [chartData, setChartData] = useState([]);

  // Fetch citizen's issues
  const { data: issues = [], isLoading: loadingIssues } = useQuery({
    queryKey: ["citizenIssues", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await fetch(`${backend}/issues?email=${user.email}`);
      return res.json();
    },
    enabled: !!user?.email,
  });

  // Fetch citizen's payments (if applicable)
  const { data: payments = [], isLoading: loadingPayments } = useQuery({
    queryKey: ["citizenPayments", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await fetch(`${backend}/payments?email=${user.email}`);
      return res.json();
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (issues.length && payments.length) {
      // Monthly payments chart
      const monthlyTotals = Array(12).fill(0);
      payments.forEach((p) => {
        const month = new Date(p.date).getMonth();
        monthlyTotals[month] += p.amount;
      });
      setChartData(
        monthlyTotals.map((total, i) => ({
          month: i + 1,
          amount: total,
        }))
      );
    }
  }, [issues, payments]);

  if (loadingIssues || loadingPayments)
    return <p className="text-lg">Loading dashboard...</p>;

  const totalIssues = issues.length;
  const pendingIssues = issues.filter((i) => i.status === "Pending").length;
  const inProgressIssues = issues.filter((i) => i.status === "In-progress").length;
  const resolvedIssues = issues.filter((i) => i.status === "Resolved").length;
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    { title: "Total Issues", value: totalIssues, color: "bg-blue-500" },
    { title: "Pending Issues", value: pendingIssues, color: "bg-yellow-500" },
    { title: "In-Progress Issues", value: inProgressIssues, color: "bg-purple-500" },
    { title: "Resolved Issues", value: resolvedIssues, color: "bg-green-500" },
    { title: "Total Payments (Tk)", value: totalPayments, color: "bg-red-500" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Citizen Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`p-6 rounded shadow-lg text-white ${stat.color}`}
          >
            <h3 className="text-lg font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly Payments Chart */}
      <div className="bg-white p-6 rounded shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Monthly Payments Overview</h3>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {user?.blocked && (
        <p className="mt-4 text-red-600 font-semibold">
          Your account is blocked. You cannot submit, edit, upvote, or boost issues.
        </p>
      )}
    </div>
  );
};

export default CitizenDashboard;
