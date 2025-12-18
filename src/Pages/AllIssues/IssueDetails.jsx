import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../Components/Shared/Loading";
import Swal from "sweetalert2";
import { imageUpload } from "../../Utils";
import { ThumbsUp } from "lucide-react";

const backend = "http://localhost:3000";

const IssueDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // FETCH ISSUE
  const { data: issue, isLoading } = useQuery({
    queryKey: ["issue", id],
    queryFn: async () => {
      const res = await axios.get(`${backend}/issues/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // UPVOTE
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

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: async () => axios.delete(`${backend}/issues/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["issues"]);
      navigate("/dashboard/my-issues");
    },
  });

  const handleDelete = () => {
    Swal.fire({
      title: "Delete this issue?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    }).then((res) => {
      if (res.isConfirmed) deleteMutation.mutate();
    });
  };

  // BOOST
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
    if (confirm("Boost issue for 100 BDT ?")) boostMutation.mutate();
  };

  // EDIT
  const editMutation = useMutation({
    mutationFn: async (data) =>
      axios.patch(`${backend}/issues/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["issue", id]);
      queryClient.invalidateQueries(["issues"]);
      toast.success("Issue updated successfully!");
      setShowEditModal(false);
    },
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    editMutation.mutate({
      title: form.title.value,
      category: form.category.value,
      location: form.location.value,
      description: form.description.value,
      image: imageUrl || issue.image,
    });
  };

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      const url = await imageUpload(file);
      setImageUrl(url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-4">{issue.title}</h1>

      <img src={issue.image} className="w-full h-80 object-cover rounded mb-6" />

      <div className="space-y-2 text-lg">
        <p><strong>Category:</strong> {issue.category}</p>
        <p><strong>Location:</strong> {issue.location}</p>
        <p><strong>Status:</strong> {issue.status}</p>
        <p><strong>Description:</strong> {issue.description}</p>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleUpvote}
          className="px-4 py-2 bg-gradient hover:scale-103 text-white rounded flex items-center justify-center gap-2 font-bold text-lg"
        >
          <ThumbsUp></ThumbsUp> <span className="mt-1">{issue.upvoteCount || 0}</span>
        </button>

         {/* 👍  */}

        {user?.email === issue.email && (
          <button
            disabled={issue.status !== "Pending"}
            onClick={() => setShowEditModal(true)}
            className={`px-4 py-2 text-white rounded ${issue.status !== "Pending"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary"
              }`}
          >
            Edit
          </button>
        )}

        {user?.email === issue.email && (
          <button
            disabled={issue.status !== "Pending"}
            onClick={handleDelete}
            className={`px-4 py-2 text-white rounded ${issue.status !== "Pending"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600"
              }`}
          >
            Delete
          </button>
        )}

        {user?.email === issue.email && issue.priority !== "High" && (
          <button
            onClick={handleBoost}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Boost (100 BDT)
          </button>
        )}
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded w-full max-w-lg space-y-3"
          >
            <h2 className="text-2xl font-bold">Edit Issue</h2>

            <label className="font-medium">Title</label>
            <input
              name="title"
              defaultValue={issue.title}
              className="w-full p-2 border rounded"
              required
            />

            <label className="font-medium">Photo</label>
            <input
              type="file"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="w-full p-2 border rounded"
            />

            <label className="font-medium">Category</label>
            <select
              name="category"
              defaultValue={issue.category}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Road">Road</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Garbage">Garbage</option>
              <option value="Other">Other</option>
            </select>

            <label className="font-medium">Location</label>
            <input
              name="location"
              defaultValue={issue.location}
              className="w-full p-2 border rounded"
              required
            />

            <label className="font-medium">Description</label>
            <textarea
              name="description"
              defaultValue={issue.description}
              className="w-full p-2 border rounded"
              rows="4"
              required
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 btn-btn text-white rounded"
              >
                {uploading ? "Uploading..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default IssueDetails;
