import React, { useContext } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { AuthContext } from "../../Context/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../Components/Shared/Loading";

const backend = "http://localhost:3000";

const IssueDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // FETCH SINGLE ISSUE ------------------------------------------
  const { data: issue, isLoading } = useQuery({
    queryKey: ["issue", id],
    queryFn: async () => {
      const res = await axios.get(`${backend}/issues/${id}`);
      return res.data;
    },
  });

  // UPVOTE --------------------------------------------------------
  const upvoteMutation = useMutation({
    mutationFn: async () =>
      axios.patch(`${backend}/issues/upvote/${id}`, {
        userEmail: user?.email,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries(["issue", id]);
      queryClient.invalidateQueries(["issues"]);
    },
  });

  const handleUpvote = () => {
    if (!user) return navigate("/login");

    if (issue.email === user.email)
      return toast.error("You cannot upvote your own issue!");

    if (issue.upvotedBy?.includes(user.email))
      return toast.error("You already upvoted!");

    upvoteMutation.mutate();
  };

  // DELETE --------------------------------------------------------
  const deleteMutation = useMutation({
    mutationFn: async () => axios.delete(`${backend}/issues/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["issues"]);
      navigate("/dashboard/my-issues");
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this issue?")) {
      deleteMutation.mutate();
    }
  };

  // BOOST PRIORITY ------------------------------------------------
  const boostMutation = useMutation({
    mutationFn: async () =>
      axios.patch(`${backend}/issues/boost/${id}`, {
        userEmail: user?.email,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["issue", id]);
      queryClient.invalidateQueries(["issues"]);
      alert("Payment successful! Issue boosted.");
    },
  });

  const handleBoost = () => {
    if (issue.priority === "High") return;

    // Payment popup example (replace later with real payment)
    const ok = confirm("Boost issue for 100 BDT ?");
    if (ok) boostMutation.mutate();
  };

  if (isLoading) return <Loading></Loading>;
  if (!issue) return <p className="my-20 text-4xl text-center font-extrabold">Issue not found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-4">{issue.title}</h1>

      <img
        src={issue.image}
        className="w-full h-80 object-cover rounded-lg mb-6"
      />

      {/* BASIC INFO */}
      <div className="space-y-2 text-lg">
        <p><strong>Category:</strong> {issue.category}</p>
        <p><strong>Location:</strong> {issue.location}</p>
        <p><strong>Status:</strong> {issue.status}</p>
        <p>
          <strong>Priority:</strong>{" "}
          <span
            className={`px-2 py-1 rounded ${
              issue.priority === "High" ? "bg-red-200" : "bg-blue-200"
            }`}
          >
            {issue.priority}
          </span>
        </p>
        <p><strong>Description:</strong> {issue.description}</p>
      </div>

      {/* BUTTONS ------------------------------------------------ */}
      <div className="flex gap-4 mt-6">

        {/* UPVOTE */}
        <button
          onClick={handleUpvote}
          className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
        >
          👍 Upvote {issue.upvoteCount || 0}
        </button>

        {/* EDIT (only owner + Pending) */}
        {user?.email === issue.email && issue.status === "Pending" && (
          <Link
            to={`/issues/edit/${issue._id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit
          </Link>
        )}

        {/* DELETE (only owner) */}
        {user?.email === issue.email && (
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        )}

        {/* BOOST PRIORITY */}
        {user?.email === issue.email && issue.priority !== "High" && (
          <button
            onClick={handleBoost}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Boost (100 BDT)
          </button>
        )}
      </div>

      {/* STAFF INFO ------------------------------------------- */}
      {issue.assignedStaff && (
        <div className="mt-8 p-4 border rounded">
          <h2 className="text-xl font-bold mb-2">Assigned Staff</h2>
          <p><strong>Name:</strong> {issue.assignedStaff.name}</p>
          <p><strong>Email:</strong> {issue.assignedStaff.email}</p>
        </div>
      )}

      {/* TIMELINE --------------------------------------------- */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Issue Timeline</h2>

        <div className="border-l-4 border-green-400 pl-6 space-y-6">
          {issue.timeline
            .slice()
            .reverse()
            .map((t, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-3 top-1 w-4 h-4 bg-green-500 rounded-full mr-4"></div>

                <p className="text-sm text-gray-500 ml-3">
                  {new Date(t.time).toLocaleString()}
                </p>

                <p className="font-bold ml-3">
                  {t.status}
                </p>

                <p className="text-gray-700 ml-3">{t.message}</p>

                <p className="text-sm text-gray-600 ml-3">
                  Updated by: <strong>{t.updatedBy}</strong>
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
