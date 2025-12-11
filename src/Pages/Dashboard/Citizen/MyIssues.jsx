import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import { Link } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

const backend = "http://localhost:3000";

const MyIssues = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    status: "",
    category: "",
    search: "",
  });

  const [editIssue, setEditIssue] = useState(null); // issue to edit

  // Fetch issues for logged-in user
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["myIssues", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await fetch(`${backend}/issues?email=${user.email}`);
      return res.json();
    },
    enabled: !!user?.email,
  });

  // Delete issue mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${backend}/issues/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(["myIssues", user.email], (old) =>
        old.filter((i) => i._id !== id)
      );
    },
  });

  // Update issue mutation
  const updateMutation = useMutation({
    mutationFn: async (issueData) => {
      const { _id, ...rest } = issueData;
      const res = await axios.patch(`${backend}/issues/${_id}`, rest);
      return res.data;
    },
    onSuccess: (updatedIssue) => {
      queryClient.setQueryData(["myIssues", user.email], (old) =>
        old.map((i) => (i._id === updatedIssue._id ? updatedIssue : i))
      );
      setEditIssue(null);
    },
  });

  if (isLoading) return <p>Loading...</p>;

  // Apply filters
  let filtered = [...issues];
  if (filters.status) filtered = filtered.filter((i) => i.status === filters.status);
  if (filters.category) filtered = filtered.filter((i) => i.category === filters.category);
  if (filters.search)
    filtered = filtered.filter((i) =>
      i.title.toLowerCase().includes(filters.search.toLowerCase())
    );

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">My Issues</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="p-2 border rounded"
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
        >
          <option value="">Status</option>
          <option value="Pending">Pending</option>
          <option value="In-progress">In-progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          className="p-2 border rounded"
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
        >
          <option value="">Category</option>
          <option value="Road">Road</option>
          <option value="Garbage">Garbage</option>
          <option value="Water">Water</option>
          <option value="Electricity">Electricity</option>
        </select>

        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded flex-1"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />
      </div>

      {/* Issues Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Priority</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((issue) => (
              <tr key={issue._id} className="text-center">
                <td className="border p-2">{issue.title}</td>
                <td className="border p-2">{issue.category}</td>
                <td className="border p-2">{issue.status}</td>
                <td className="border p-2">{issue.priority}</td>
                <td className="border p-2 flex gap-2 justify-center">
                  {issue.status === "Pending" && (
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                      onClick={() => setEditIssue(issue)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "This issue will be permanently deleted!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Yes, delete it!"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          deleteMutation.mutate(issue._id);

                          Swal.fire({
                            title: "Deleted!",
                            text: "The issue has been removed.",
                            icon: "success",
                            timer: 1400,
                            showConfirmButton: false,
                          });
                        }
                      });
                    }}
                  >
                    Delete
                  </button>

                  <Link
                    to={`/issues/${issue._id}`}
                    className="px-3 py-1 bg-gray-800 text-white rounded"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editIssue && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-3xl font-bold mb-4">Edit Issue</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = {
                  _id: editIssue._id,
                  title: e.target.title.value,
                  category: e.target.category.value,
                  priority: e.target.priority.value,
                  location: e.target.location.value,
                  description: e.target.description.value,
                };
                updateMutation.mutate(formData);
              }}
            >
              <label className="font-bold text-lg">Title</label>
              <input
                type="text"
                name="title"
                defaultValue={editIssue.title}
                placeholder="Title"
                className="w-full p-2 border rounded mb-2"
                required
              />
              <label className="font-bold text-lg">Category</label>
              <select
                name="category"
                defaultValue={editIssue.category}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="Road">Road</option>
                <option value="Garbage">Garbage</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Others">Others</option>
              </select>
              <label className="font-bold text-lg">Priority</label>
              <select
                name="priority"
                defaultValue={editIssue.priority}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
              <label className="font-bold text-lg">Location</label>
              <input
                type="text"
                name="location"
                defaultValue={editIssue.location}
                placeholder="Location"
                className="w-full p-2 border rounded mb-2"
              />
              <label className="font-bold text-lg">Description</label>
              <textarea
                name="description"
                defaultValue={editIssue.description}
                placeholder="Description"
                className="w-full p-2 border rounded mb-2"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-1 bg-gray-400 rounded"
                  onClick={() => setEditIssue(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1 bg-green-600 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIssues;
