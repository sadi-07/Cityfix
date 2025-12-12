import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const backend = "http://localhost:3000";

const AdminDashboard = () => {
  // Fetch statistics
  const { data: stats = {} } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axios.get(`${backend}/admin/stats`);
      return res.data;
    },
  });

  // Latest 5 issues
  const { data: latestIssues = [] } = useQuery({
    queryKey: ["latestIssues"],
    queryFn: async () => {
      const res = await axios.get(`${backend}/admin/latest-issues`);
      return res.data;
    },
  });

  // Latest 5 payments
  const { data: latestPayments = [] } = useQuery({
    queryKey: ["latestPayments"],
    queryFn: async () => {
      const res = await axios.get(`${backend}/admin/latest-payments`);
      return res.data;
    },
  });

  // Latest 5 users
  const { data: latestUsers = [] } = useQuery({
    queryKey: ["latestUsers"],
    queryFn: async () => {
      const res = await axios.get(`${backend}/admin/latest-users`);
      return res.data;
    },
  });

  console.log(stats.resolvedIssues)
  console.log(stats.rejectedIssues)

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* ====================== STATS CARDS ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card title="Total Issues" value={stats.totalIssues} color="bg-blue-700" />
        <Card title="Pending Issues" value={stats.pendingIssues} color="bg-yellow-700" />
        <Card title="Resolved Issues" value={stats.resolvedIssues} color="bg-green-700" />
        <Card title="Rejected Issues" value={stats.rejectedIssues} color="bg-red-700" />
        <Card title="Boosted Issues" value={stats.boostedIssues} color="bg-purple-700" />
        <Card title="Total Users" value={stats.totalUsers} color="bg-indigo-700" />
        <Card title="Total Payments (৳)" value={stats.totalPayments} color="bg-emerald-700" />

      </div>


      {/* Latest Issues */}
      <Section title="Latest Issues" data={latestIssues} fields={["title", "status", "priority"]} />

      {/* Latest Payments */}
      <Section title="Latest Payments" data={latestPayments} fields={["email", "amount"]} />

      {/* Latest Users */}
      <Section title="Latest Users" data={latestUsers} fields={["name", "email"]} />
    </div>
  );
};

// ======================= CARD COMPONENT =======================
const Card = ({ title, value, color }) => (
  <div className={`p-6 text-white shadow rounded ${color}`}>
    <h3 className="opacity-80">{title}</h3>
    <p className="text-3xl font-bold">{value ?? 0}</p>
  </div>
);


// ======================= TABLE SECTION =======================
const Section = ({ title, data, fields }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="bg-white shadow rounded p-4">
      <table className="w-full">
        <thead>
          <tr>
            {fields.map((f) => (
              <th key={f} className="text-left p-2 capitalize">{f}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-t">
              {fields.map((f) => (
                <td key={f} className="p-2">
                  {item[f]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboard;
