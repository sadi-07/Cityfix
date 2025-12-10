import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const AllIssues = () => {
  const [filteredIssues, setFilteredIssues] = useState([]);

  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const backend = "http://localhost:3000";

  // 🔥 TQuery Setup
  const queryClient = useQueryClient();

  // 🔥 Fetch All Issues (Mandatory TanStack Query)
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const res = await axios.get(`${backend}/issues`);
      return res.data;
    },
  });

  // 🔥 FILTER + SEARCH
  useEffect(() => {
    let data = [...issues];

    if (category) data = data.filter((i) => i.category === category);
    if (status) data = data.filter((i) => i.status === status);
    if (priority) data = data.filter((i) => i.priority === priority);

    if (search.trim()) {
      data = data.filter((i) =>
        i.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort: boosted/upvoted issues first
    data.sort(
      (a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0)
    );

    setFilteredIssues(data);
  }, [category, status, priority, search, issues]);

  // Upvote Mutation (TANSTACK QUERY)
  const upvoteMutation = useMutation({
    mutationFn: async (issue) => {
      if (!user) return navigate("/login");

      return axios.patch(`${backend}/issues/upvote/${issue._id}`, {
        userEmail: user.email,
      });
    },

    // After success → re-fetch issues
    onSuccess: () => {
      queryClient.invalidateQueries(["issues"]);
    },
  });

  // 🔥 Handle Upvote
  const handleUpvote = (issue) => {
    if (!user) return navigate("/login");

    if (issue.email === user.email)
      return toast.error("You cannot upvote your own issue!");

    if (issue?.upvotedBy?.includes(user.email))
      return toast.error("You already upvoted this!");

    upvoteMutation.mutate(issue);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">All Issues</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="p-2 border rounded"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Category</option>
          <option value="Road">Road</option>
          <option value="Garbage">Garbage</option>
          <option value="Water">Water</option>
          <option value="Electricity">Electricity</option>
        </select>

        <select
          className="p-2 border rounded"
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Pending">Pending</option>
          <option value="In-progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          className="p-2 border rounded"
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Priority</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
        </select>

        <input
          type="text"
          placeholder="Search issue..."
          className="p-2 border rounded flex-1"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Issues List */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredIssues.map((issue) => (
          <div key={issue._id} className="shadow-lg border rounded p-4">
            <img
              src={issue.image}
              alt={issue.title}
              className="h-40 w-full object-cover rounded mb-3"
            />

            <h2 className="text-xl font-bold">{issue.title}</h2>
            <p className="text-gray-600">{issue.location}</p>

            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 text-xs bg-gray-200 rounded">
                {issue.category}
              </span>

              <span
                className={`px-2 py-1 text-xs rounded ${
                  issue.priority === "High" ? "bg-red-200" : "bg-blue-200"
                }`}
              >
                {issue.priority}
              </span>

              <span className="px-2 py-1 text-xs bg-yellow-200 rounded">
                {issue.status}
              </span>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handleUpvote(issue)}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                👍 {issue.upvoteCount || 0}
              </button>

              <Link
                to={`/issues/${issue._id}`}
                className="px-3 py-1 bg-gray-800 text-white rounded"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllIssues;
