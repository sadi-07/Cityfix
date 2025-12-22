import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ThumbsUp } from "lucide-react";
import Loading from "../../Components/Shared/Loading";

const AllIssues = () => {
  const [filteredIssues, setFilteredIssues] = useState([]);

  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const backend = "https://city-fix-server-one.vercel.app";
  const queryClient = useQueryClient();

  // 🔥 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 issues per page

  // 🔥 Fetch all issues
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const res = await axios.get(`${backend}/issues`);
      return res.data;
    },
  });

  // 🔥 Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [search]);

  // 🔥 FILTER + SORT
  useEffect(() => {
    if (!issues) return;

    let data = [...issues];

    if (category) data = data.filter((i) => i.category === category);
    if (status) data = data.filter((i) => i.status === status);
    if (priority) data = data.filter((i) => i.priority === priority);

    if (debouncedSearch.trim()) {
      data = data.filter((i) =>
        i.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Sort: boosted/high-priority issues first, then by upvoteCount
    data.sort((a, b) => {
      // Boosted/high-priority on top
      if (a.priority === "High" && b.priority !== "High") return -1;
      if (a.priority !== "High" && b.priority === "High") return 1;
      // Then by upvoteCount
      return (b.upvoteCount || 0) - (a.upvoteCount || 0);
    });

    // Only set state if array changed
    setFilteredIssues((prev) => {
      const prevIds = prev.map((i) => i._id).join(",");
      const newIds = data.map((i) => i._id).join(",");
      if (prevIds !== newIds) return data;
      return prev;
    });

    // Reset to first page whenever filters/search change
    setCurrentPage(1);
  }, [category, status, priority, debouncedSearch, issues]);

  // 🔥 Upvote Mutation
  const upvoteMutation = useMutation({
    mutationFn: async (issue) => {
      if (!user) return navigate("/login");

      return axios.patch(`${backend}/issues/upvote/${issue._id}`, {
        userEmail: user.email,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["issues"]);
    },
  });

  const handleUpvote = (issue) => {
    if (!user) return navigate("/login");

    if (issue.email === user.email)
      return toast.error("You cannot upvote your own issue!");

    if (issue?.upvotedBy?.includes(user.email))
      return toast.error("You already upvoted this!");

    upvoteMutation.mutate(issue);
  };

  if (isLoading) return <Loading />;

  // 🔥 Pagination calculations
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentIssues = filteredIssues.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">All Issues</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          className="p-2 border rounded"
          value={category}
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
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Pending">Pending</option>
          <option value="In-progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          className="p-2 border rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Priority</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
        </select>

        <input
          type="text"
          placeholder="Search issue..."
          className="p-2 border rounded flex-1 min-w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Issues List */}
      <div className="grid md:grid-cols-3 gap-6">
        {currentIssues.map((issue) => (
          <div
            key={issue._id}
            className="shadow-lg border border-gray-400 rounded p-4 hover:scale-103 hover:shadow-xl transition"
          >
            {issue.image && (
              <img
                src={issue.image}
                alt={issue.title}
                className="h-40 w-full object-cover rounded mb-3"
              />
            )}

            <h2 className="text-xl font-bold">{issue.title}</h2>
            <p className="text-gray-600">{issue.location}</p>

            <div className="flex gap-2 mt-2 flex-wrap">
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

            <div className="mt-4 flex justify-between items-center flex-wrap gap-2">
              <button
                onClick={() => handleUpvote(issue)}
                className="px-3 py-1 bg-green-600 text-white rounded flex bg-gradient gap-2 items-center justify-center font-bold"
              >
                <ThumbsUp /> <span className="mt-1"> {issue.upvoteCount || 0} </span>
              </button>

              <Link
                to={`/issues/${issue._id}`}
                className="px-4 py-2 font-bold bg-gray-800 text-white rounded"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllIssues;
