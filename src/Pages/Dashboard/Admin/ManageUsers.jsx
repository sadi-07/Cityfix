import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../../Components/Shared/Loading";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const backend = "https://city-fix-server-one.vercel.app";

const ManageUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axios.get(`${backend}/users`);
      return res.data.filter((u) => u.role === "citizen"); 
    },
  });

  
  const toggleBlockMutation = useMutation({
    mutationFn: async ({ email, status }) => {
      const res = await axios.patch(`${backend}/users/block/${email}`, {
        blocked: status,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allUsers"]);
    },
  });


  const handleToggleBlock = (user) => {
  const action = user.blocked ? "Unblock" : "Block";

  Swal.fire({
    title: `${action} User?`,
    text: `Are you sure you want to ${action.toLowerCase()} ${user.name}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      toggleBlockMutation.mutate(
        { email: user.email, status: !user.blocked },
        {
          onSuccess: () => {
            toast.success(`User ${action.toLowerCase()}ed successfully!`);
          },
          onError: () => {
            toast.error(`Failed to ${action.toLowerCase()} user`);
          },
        }
      );
    }
  });
};


  if (isLoading) return <Loading></Loading>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full border bg-white rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Photo</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Subscription</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="text-center">
                <td className="border p-2">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt="user"
                    className="h-12 w-12 rounded-full mx-auto object-cover"
                  />
                </td>

                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>

                <td className="border p-2">
                  {user.subscription?.status === "active" ? (
                    <span className="text-green-600 font-semibold">
                      {user.subscription.plan} ✓
                    </span>
                  ) : (
                    <span className="text-gray-500">Free User</span>
                  )}
                </td>

                <td className="border p-2">
                  {user.blocked ? (
                    <span className="text-red-600 font-bold">Blocked</span>
                  ) : (
                    <span className="text-green-600 font-bold">Active</span>
                  )}
                </td>

                <td className="border p-2">
                  <button
                    className={`px-3 py-1 rounded text-white ${user.blocked ? "bg-green-600" : "bg-red-600"
                      }`}
                    onClick={() => handleToggleBlock(user)}
                  >
                    {user.blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan="6">
                  No citizen users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
