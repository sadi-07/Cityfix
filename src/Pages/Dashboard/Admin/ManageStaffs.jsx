import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../Firebase/firebase.config";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const backend = "http://localhost:3000";

const ManageStaff = () => {
  const queryClient = useQueryClient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStaff, setEditStaff] = useState(null);

  // Load all staff
  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await axios.get(`${backend}/users?role=staff`);
      return res.data;

    },
  });

  // ADD Staff Mutation
  const addStaffMutation = useMutation({
    mutationFn: async (staffData) => {
      // 1️⃣ Create Staff in Firebase Auth
      const fbUser = await createUserWithEmailAndPassword(
        auth,
        staffData.email,
        staffData.password
      );

      await auth.signOut();  

      const finalData = {
        name: staffData.name,
        email: staffData.email,
        phone: staffData.phone,
        photoURL: staffData.photoURL,
        role: "staff",
        uid: fbUser.user.uid,
      };

      // 2️⃣ Save to DB
      const res = await axios.post(`${backend}/users`, finalData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["staff"]);
      setShowAddModal(false);
      toast.success("Staff added successfully!");
    },
  });

  // UPDATE Staff Mutation
  const updateStaffMutation = useMutation({
    mutationFn: async ({ email, updateData }) => {
      const res = await axios.patch(`${backend}/users/update/${email}`, updateData);

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["staff"]);
      setShowEditModal(false);
      toast.success("Staff updated!");
    },
  });

  // DELETE Staff Mutation
  const deleteStaffMutation = useMutation({
    mutationFn: async (email) => {
      const res = await axios.delete(`${backend}/staff/${email}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["staff"]);
      alert("Staff deleted!");
    },
  });

  // Open edit modal
  const handleEdit = (staffData) => {
    setEditStaff(staffData);
    setShowEditModal(true);
  };

  // Delete confirmation

  const handleDelete = (email) => {
    Swal.fire({
      title: "Delete this staff?",
      text: "This action can’t be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteStaffMutation.mutate(email);
      }
    });
  };


  // Handle Add staff form submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const staffData = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      photoURL: form.photoURL.value,
      password: form.password.value,
    };

    addStaffMutation.mutate(staffData);
  };

  // Handle Update form submit
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const updateData = {
      name: form.name.value,
      phone: form.phone.value,
      photoURL: form.photoURL.value,
    };

    updateStaffMutation.mutate({
      email: editStaff.email,
      updateData,
    });
  };

  if (isLoading) return <p>Loading staff...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Staff</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Staff +
        </button>
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white border rounded">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-3 border">Photo</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {staff.map((s) => (
              <tr key={s.email}>
                <td className="border p-3">
                  <img
                    src={s.photoURL}
                    alt="staff"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="border p-3">{s.name}</td>
                <td className="border p-3">{s.email}</td>
                <td className="border p-3">{s.phone}</td>

                <td className="border p-3">
                  <button
                    onClick={() => handleEdit(s)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(s.email)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {staff.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-3 text-gray-500">
                  No staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white p-6 rounded w-96 space-y-3"
          >
            <h2 className="text-xl font-bold mb-3">Add Staff</h2>
            <label className="font-bold text-lg">Name</label>
            <input type="text" name="name" placeholder="Name" className="w-full mt-1 p-2 border rounded" required />
            <label className="font-bold text-lg">Email</label>
            <input type="email" name="email" placeholder="Email" className="w-full mt-1 p-2 border rounded" required />
            <label className="font-bold text-lg">Phone</label>
            <input type="text" name="phone" placeholder="Phone" className="w-full mt-1 p-2 border rounded" required />
            <label className="font-bold text-lg">Photo</label>
            <input type="text" name="photoURL" placeholder="Photo URL" className="w-full mt-1 p-2 border rounded" required />
            <label className="font-bold text-lg">Password</label>
            <input type="password" name="password" placeholder="Password" className="w-full mt-1 p-2 border rounded" required />

            <div className="flex justify-between mt-3">
              <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form
            onSubmit={handleUpdateSubmit}
            className="bg-white p-6 rounded w-96 space-y-3"
          >
            <h2 className="text-xl font-bold mb-3">Update Staff</h2>

            <label className="font-bold text-lg">Name</label>
            <input type="text" name="name" defaultValue={editStaff.name} className="w-full p-2 border rounded" required />
            <label className="font-bold text-lg">Phone</label>
            <input type="text" name="phone" defaultValue={editStaff.phone} className="w-full p-2 border rounded" required />
            <label className="font-bold text-lg">Photo</label>
            <input type="text" name="photoURL" defaultValue={editStaff.photoURL} className="w-full p-2 border rounded" required />

            <div className="flex justify-between mt-3">
              <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;
