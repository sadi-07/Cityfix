import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const backend = "http://localhost:3000";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      photoURL: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
      });
    }
  }, [user, reset]);

  // Update profile
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`${backend}/users/update/${user.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

  // Handle subscription (mock)
  const handleSubscribe = async () => {
    try {
      const res = await fetch(`${backend}/users/${user.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: { status: "active", plan: "Premium" } }),
      });
      const updated = await res.json();
      setUser((prev) => ({ ...prev, ...updated }));
      toast.success("Subscribed successfully! You are now a Premium user.");
    } catch (err) {
      console.log(err);
      toast.error("Subscription failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">My Profile</h1>

      {/* Blocked warning */}
      {user?.blocked && (
        <div className="bg-red-100 border border-red-400 text-red-800 p-4 rounded mb-6">
          Your account is blocked. Please contact authorities for assistance.
        </div>
      )}

      {/* Profile card */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt={user?.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            {user?.subscription?.status === "active" && (
              <span className="bg-yellow-300 text-yellow-800 text-sm font-semibold px-2 py-1 rounded">
                Premium
              </span>
            )}
          </div>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-gray-500 mt-2 capitalize">Role: {user?.role}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowModal(true)}
            disabled={user?.blocked} // optional: prevent editing if blocked
            className={`px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition ${
              user?.blocked ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Edit Profile
          </button>

          {!user?.subscription?.status && !user?.blocked && (
            <button
              onClick={handleSubscribe}
              className="px-6 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
            >
              Subscribe 1000tk
            </button>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
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
                <label className="block font-medium mb-1">Photo URL</label>
                <input
                  type="text"
                  {...register("photoURL")}
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

export default Profile;
