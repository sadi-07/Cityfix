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
import Loading from "../../../Components/Shared/Loading";

const PaymentsPage = () => {
  const [selectedMonth, setSelectedMonth] = useState("");

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await fetch("https://city-fix-server-one.vercel.app/payments");
      return res.json();
    },
  });

  if (isLoading) return <Loading />;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  
  const filteredPayments = payments.filter((p) => {
    if (!selectedMonth) return true;
    const paymentMonth = new Date(p.createdAt).getMonth();
    return months[paymentMonth] === selectedMonth;
  });

  // ================= CHART DATA =================
  
  const monthlyPayments = months.map((month, idx) => {
    const total = payments
      .filter(p => new Date(p.createdAt).getMonth() === idx)
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
    return { month, total };
  });

  return (
    <div>
      <h2 className="text-3xl font-bold mb-5">Payments</h2>

      
      <div className="flex gap-4 mb-6">
        <div>
          <label className="font-medium">Filter by Month</label>
          <select
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="ml-2 border p-2 rounded"
          >
            <option value="">All</option>
            {months.map((month, i) => (
              <option key={i} value={month}>
                {month}
              </option>
            ))}
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
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment._id} className="border">
                <td className="p-2 border">{payment.email}</td>
                <td className="p-2 border">{payment.issueId || "—"}</td>
                <td className="p-2 border">{payment.amount} Tk</td>
                <td className="p-2 border">
                  {new Date(payment.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}

            {filteredPayments.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="p-3 text-center text-gray-600 italic"
                >
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Chart */}
      <div className="bg-white p-6 rounded shadow mt-6">
        <h3 className="text-xl font-semibold mb-4">Monthly Payments (৳)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyPayments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


    </div>
  );
};

export default PaymentsPage;
