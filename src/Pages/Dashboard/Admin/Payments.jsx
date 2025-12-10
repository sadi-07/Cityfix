import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const PaymentsPage = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/payments");
      return res.json();
    },
  });

  if (isLoading) return <p className="text-lg">Loading payments...</p>;

  // Apply filters
  const filteredPayments = payments.filter((p) => {
    const monthMatch =
      selectedMonth === "" ||
      new Date(p.date).getMonth() + 1 === Number(selectedMonth);

    const methodMatch =
      methodFilter === "all" || p.method.toLowerCase() === methodFilter;

    return monthMatch && methodMatch;
  });

  // Chart Processing (Optional)
  const monthlyTotals = Array(12).fill(0);
  payments.forEach((p) => {
    const m = new Date(p.date).getMonth();
    monthlyTotals[m] += p.amount;
  });

  const chartData = monthlyTotals.map((total, index) => ({
    month: index + 1,
    amount: total,
  }));

  return (
    <div>
      <h2 className="text-3xl font-bold mb-5">Payments</h2>

      {/* Filter Section */}
      <div className="flex gap-4 mb-6">
        {/* Month Filter */}
        <div>
          <label className="font-medium">Filter by Month</label>
          <select
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="ml-2 border p-2 rounded"
          >
            <option value="">All</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Filter */}
        <div>
          <label className="font-medium">Payment Method</label>
          <select
            onChange={(e) => setMethodFilter(e.target.value)}
            className="ml-2 border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="card">Card</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Issue ID</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Method</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment._id} className="border">
                <td className="p-2 border">{payment.userEmail}</td>
                <td className="p-2 border">{payment.issueId}</td>
                <td className="p-2 border">{payment.amount} Tk</td>
                <td className="p-2 border capitalize">{payment.method}</td>
                <td className="p-2 border">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {filteredPayments.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-3 text-center text-gray-600 italic"
                >
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Optional Chart Section */}
      <h3 className="text-2xl font-semibold mt-10 mb-4">
        Monthly Payment Overview (Optional)
      </h3>

      <div className="w-full h-72 bg-white border rounded p-4">
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
  );
};

export default PaymentsPage;
