import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { imageUpload } from "../../../Utils";

const backend = "https://city-fix-server-one.vercel.app";

const AdminProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
  name: "",
  email: "",
},

  });

  useEffect(() => {
    if (user) {
      reset({
  name: user.name || "",
  email: user.email || "",
});

    }
  }, [user, reset]);

  const onSubmit = async (data) => {
  setLoading(true);
  try {
    let photoURL = user.photoURL;

    // upload image if selected
    if (data.image && data.image[0]) {
      photoURL = await imageUpload(data.image[0]);
    }

    const payload = {
      name: data.name,
      photoURL,
    };

    const res = await fetch(`${backend}/users/update/${user.email}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const updated = await res.json();
    setUser((prev) => ({ ...prev, ...updated }));
    toast.success("Profile updated successfully");
    setShowModal(false);
  } catch (err) {
    console.log(err);
    toast.error("Failed to update profile");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Profile</h1>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt={user?.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-gray-500 mt-2 capitalize">Role: {user?.role}</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 btn-btn text-white font-medium rounded transition"
        >
          Edit Profile
        </button>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Email (readonly)</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full border p-2 rounded bg-gray-100"
                  readOnly
                />
              </div>

              <div>
  <label className="block font-medium mb-1">Profile Photo</label>
  <input
    type="file"
    accept="image/*"
    {...register("image")}
    className="w-full border p-2 rounded"
  />
</div>


              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
