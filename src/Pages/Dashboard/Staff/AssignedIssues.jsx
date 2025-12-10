import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import axios from "axios";

const backend = "http://localhost:3000";

const statusFlow = {
  Pending: ["In-Progress"],
  "In-Progress": ["Working"],
  Working: ["Resolved"],
  Resolved: ["Closed"],
};

const AssignedIssues = () => {
  const { user } = useContext(AuthContext);
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Fetch staff assigned issues
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get(`${backend}/issues/assigned/${user.email}`);
        setIssues(res.data);
        setFilteredIssues(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchIssues();
  }, [user.email]);

  // Filters
  useEffect(() => {
    let data = [...issues];
    if (statusFilter) data = data.filter((i) => i.status === statusFilter);
    if (priorityFilter) data = data.filter((i) => i.priority === priorityFilter);
    // Boosted issues first
    data.sort((a, b) => (b.priority === "High" ? 1 : 0) - (a.priority === "High" ? 1 : 0));
    setFilteredIssues(data);
  }, [statusFilter, priorityFilter, issues]);

  // Handle status change
  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const res = await axios.patch(`${backend}/issues/status/${issueId}`, {
        status: newStatus,
        updatedBy: user.email,
      });

      // Update UI instantly
      setIssues((prev) =>
        prev.map((i) => (i._id === issueId ? { ...i, ...res.data } : i))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Assigned Issues</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Working">Working</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          className="border p-2 rounded"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Priority</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredIssues.map((issue) => (
            <tr key={issue._id} className="text-center">
              <td className="border px-4 py-2">{issue.title}</td>
              <td className="border px-4 py-2">{issue.category}</td>
              <td className="border px-4 py-2">{issue.status}</td>
              <td className="border px-4 py-2">{issue.priority}</td>
              <td className="border px-4 py-2">
                {statusFlow[issue.status]?.map((nextStatus) => (
                  <button
                    key={nextStatus}
                    className="bg-blue-600 text-white px-3 py-1 rounded m-1"
                    onClick={() => handleStatusChange(issue._id, nextStatus)}
                  >
                    {nextStatus}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedIssues;
