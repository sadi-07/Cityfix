import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../Firebase/firebase.config";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { imageUpload } from "../../../Utils";

const backend = "https://city-fix-server-one.vercel.app";

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

  // ADD Staff
  const addStaffMutation = useMutation({
    mutationFn: async (staffData) => {
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

      const res = await axios.post(`${backend}/users`, finalData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["staff"]);
      setShowAddModal(false);
      toast.success("Staff added successfully!");
    },
  });

  // UPDATE Staff
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

  // DELETE Staff
  const deleteStaffMutation = useMutation({
    mutationFn: async (email) => {
      const res = await axios.delete(`${backend}/staff/${email}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["staff"]);
      toast.success("Staff deleted!");
    },
  });

  const handleEdit = (staffData) => {
    setEditStaff(staffData);
    setShowEditModal(true);
  };

  const handleDelete = (email) => {
    Swal.fire({
      title: "Delete this staff?",
      text: "This action can’t be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteStaffMutation.mutate(email);
      }
    });
  };

  // ADD submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    let photoURL = "";
    if (form.image.files[0]) {
      photoURL = await imageUpload(form.image.files[0]);
    }

    addStaffMutation.mutate({
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      password: form.password.value,
      photoURL,
    });
  };

  // UPDATE submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    let photoURL = editStaff.photoURL;
    if (form.image.files[0]) {
      photoURL = await imageUpload(form.image.files[0]);
    }

    updateStaffMutation.mutate({
      email: editStaff.email,
      updateData: {
        name: form.name.value,
        phone: form.phone.value,
        photoURL,
      },
    });
  };

  if (isLoading) return <p>Loading staff...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Staff</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 btn-btn text-white rounded"
        >
          Add Staff +
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full bg-white border rounded">
        <thead className="bg-gray-100">
          <tr>
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
                <img src={s.photoURL} className="w-12 h-12 rounded-full mx-auto" />
              </td>
              <td className="border p-3 text-center">{s.name}</td>
              <td className="border p-3 text-center">{s.email}</td>
              <td className="border p-3 text-center">{s.phone}</td>
              <td className="border p-3 text-center">
                <button
                  onClick={() => handleEdit(s)}
                  className="px-3 py-1 btn-btn cursor-pointer text-white rounded mr-2"
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
        </tbody>
      </table>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white p-6 rounded w-96 space-y-3"
          >
            <h2 className="text-xl font-bold mb-3">Add Staff</h2>

            <label className="font-bold">Name</label>
            <input name="name" className="w-full p-2 border rounded" required />

            <label className="font-bold">Email</label>
            <input name="email" type="email" className="w-full p-2 border rounded" required />

            <label className="font-bold">Phone</label>
            <input name="phone" className="w-full p-2 border rounded" required />

            <label className="font-bold">Photo</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full p-2 border rounded"
              required
            />

            <label className="font-bold">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border rounded"
              required
            />

            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 btn-btn text-white rounded"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}


      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleUpdateSubmit}
            className="bg-white p-6 rounded w-96 space-y-3"
          >
            <h2 className="text-2xl font-bold mb-3">Update Staff</h2>

            <label className="font-bold">Name</label>
            <input
              name="name"
              defaultValue={editStaff.name}
              className="w-full p-2 border rounded"
              required
            />

            <label className="font-bold">Phone</label>
            <input
              name="phone"
              defaultValue={editStaff.phone}
              className="w-full p-2 border rounded"
              required
            />

            <label className="font-bold">Photo (optional)</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full p-2 border rounded"
            />

            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 btn-btn text-white rounded"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default ManageStaff;
