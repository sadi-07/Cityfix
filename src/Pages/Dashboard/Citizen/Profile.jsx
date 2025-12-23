import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { imageUpload } from "../../../Utils";
import Loading from "../../../Components/Shared/Loading";
import { useQuery } from "@tanstack/react-query";

const backend = "https://city-fix-server-one.vercel.app";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // ✅ Show blocked modal once user data is fully loaded
  useEffect(() => {
    if (!userLoading && user?.blocked) {
      setShowBlockedModal(true);
    }
  }, [user, userLoading]);

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

      if (data.image && data.image[0]) {
        photoURL = await imageUpload(data.image[0]);
      }

      const payload = { name: data.name, photoURL };

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

  const handleSubscribe = async () => {
    try {
      const res = await fetch(`${backend}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "subscribe",
          email: user.email,
        }),
      });

      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      toast.error("Payment failed");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.email) return;

      try {
        setUserLoading(true);

        const res = await fetch(`${backend}/users/${user.email}`);
        const updatedUser = await res.json();

        setUser((prev) => ({
          ...prev,
          ...updatedUser,
        }));
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [user?.email, setUser]);

  if (!user) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  if (!user || userLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">My Profile</h1>

      {user.blocked && (
        <div className="bg-red-100 border border-red-400 text-red-800 p-4 rounded mb-6">
          Your account is blocked. Please contact authorities for assistance.
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={user.photoURL || "/default-avatar.png"}
          alt={user.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>

            {user.premium && (
              <span className="bg-yellow-300 text-yellow-800 text-sm font-semibold px-2 py-1 rounded">
                Premium
              </span>
            )}
          </div>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-500 mt-2 capitalize">Role: {user.role}</p>
        </div>

        <div className="flex flex-col gap-2">
          {/* Edit Profile Button */}
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 btn-btn text-white font-medium rounded transition cursor-pointer"
          >
            Edit Profile
          </button>

          {!user.premium && !user.blocked && (
            <button
              onClick={handleSubscribe}
              className="px-6 py-2 btn-btn text-white font-medium rounded transition cursor-pointer"
            >
              Subscribe
            </button>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showModal && !user.blocked && (
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
                  className="px-4 py-2 btn-btn text-white rounded hover:bg-primary-focus transition"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBlockedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-3">
              Account Blocked
            </h2>
            <p className="text-gray-700 mb-5">
              Your account has been blocked by the admin.
              <br />
              Please contact the authorities for assistance.
            </p>
            <button
              onClick={() => setShowBlockedModal(false)}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
