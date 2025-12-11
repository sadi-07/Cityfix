import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthProvider";
import Loading from "../../../Components/Shared/Loading";

const AllIssuesAdmin = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");

  // ⭐ FIXED — Correct backend route
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["all-issues"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/issues");
      return res.json();
    },
  });

  // ⭐ Fetch staff
  const { data: staffList = [] } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/users?role=staff");
      return res.json();
    },
  });

  // ⭐ Assign Staff Mutation
  const assignStaffMutation = useMutation({
    mutationFn: async ({ issueId, staff }) => {
      const res = await fetch(
        `http://localhost:3000/issues/assign-staff/${issueId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ staff }),
        }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-issues"]);
      setShowModal(false);
      Swal.fire("Success!", "Staff assigned successfully", "success");
    },
  });

  // ⭐ Reject issue Mutation
  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`http://localhost:3000/issues/reject/${id}`, {
        method: "PATCH",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-issues"]);
      Swal.fire("Rejected!", "Issue has been rejected", "success");
    },
  });

  if (isLoading) return <Loading />;

  // ⭐ Correct sorting logic
  const sortedIssues = [...issues].sort((a, b) => {
    const aHigh = a.priority === "high";
    const bHigh = b.priority === "high";
    if (aHigh && !bHigh) return -1;
    if (!aHigh && bHigh) return 1;
    return 0;
  });

  console.log(sortedIssues);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-5">All Issues (Admin)</h2>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Priority</th>
              <th className="p-2 border">Assigned Staff</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedIssues.map((issue) => (
              <tr key={issue._id} className="border">
                <td className="p-2 border">{issue.title}</td>
                <td className="p-2 border">{issue.category}</td>
                <td className="p-2 border">{issue.status}</td>

                <td
                  className={`p-2 border ${
                    issue.priority === "high"
                      ? "text-red-600 font-bold"
                      : "text-gray-700"
                  }`}
                >
                  {issue.priority}
                </td>

                <td className="p-2 border">
                  {issue.assignedStaff ? (
                    `${issue.assignedStaff.name} (${issue.assignedStaff.email})`
                  ) : (
                    <span className="text-gray-500">Not assigned</span>
                  )}
                </td>

                <td className="p-2 border flex gap-2">

                  {/* Assign Staff */}
                  {!issue.assignedStaff && issue.status !== "rejected" && (
                    <button
                      onClick={() => {
                        setSelectedIssue(issue);
                        setShowModal(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Assign
                    </button>
                  )}

                  {/* Reject */}
                  {issue.status === "pending" && (
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: "Reject this issue?",
                          text: "This action cannot be undone.",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, reject",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            rejectMutation.mutate(issue._id);
                          }
                        })
                      }
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Staff Modal */}
      {showModal && selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              Assign Staff for: {selectedIssue.title}
            </h2>

            <label className="block mb-2 font-medium">Select Staff</label>
            <select
              className="w-full border p-2 rounded"
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              <option value="">Select One</option>
              {staffList.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.name} ({staff.email})
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 rounded"
              >
                Cancel
              </button>

              <button
                disabled={!selectedStaff}
                onClick={() =>
                  assignStaffMutation.mutate({
                    issueId: selectedIssue._id,
                    staff: selectedStaff,
                  })
                }
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllIssuesAdmin;
