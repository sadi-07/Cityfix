import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import axios from "axios";
import { useForm } from "react-hook-form";

const backend = "http://localhost:3000";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  // Update profile
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Upload photo if exists
      let photoURL = user.photoURL;
      if (data.photo && data.photo[0]) {
        const file = data.photo[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise((resolve) => {
          reader.onload = () => {
            photoURL = reader.result;
            resolve();
          };
        });
      }

      const updatedUser = {
        name: data.name || user.name,
        photoURL,
      };

      // Update backend
      await axios.patch(`${backend}/users/${user.email}`, updatedUser);

      // Update local context
      setUser((prev) => ({ ...prev, ...updatedUser }));

      alert("Profile updated successfully!");
      reset();
    } catch (err) {
      console.log(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle subscription payment (mock)
  const handleSubscribe = async () => {
    try {
      setLoading(true);

      // Simulate payment success
      const updatedUser = { role: "premium" };

      // Update backend
      await axios.patch(`${backend}/users/${user.email}`, updatedUser);

      // Update local context
      setUser((prev) => ({ ...prev, ...updatedUser }));

      alert("Subscription successful! You are now a premium user.");
    } catch (err) {
      console.log(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      {/* Blocked Warning */}
      {user?.blocked && (
        <div className="p-2 mb-4 bg-red-100 text-red-700 rounded">
          Your account has been blocked by admin. Please contact the authorities.
        </div>
      )}

      <div className="flex items-center gap-4 mb-4">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt={user?.name}
          className="h-20 w-20 rounded-full object-cover border"
        />
        <div>
          <h3 className="text-xl font-semibold">
            {user?.name}{" "}
            {user?.role === "premium" && (
              <span className="ml-2 px-2 py-1 bg-yellow-300 text-sm rounded-full">
                Premium
              </span>
            )}
          </h3>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Name"
          defaultValue={user?.name}
          className="p-2 border rounded"
          {...register("name")}
        />
        <input type="file" {...register("photo")} />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded mt-2"
          disabled={loading}
        >
          Update Profile
        </button>
      </form>

      {/* Subscription button */}
      {user?.role !== "premium" && !user?.blocked && (
        <button
          onClick={handleSubscribe}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Subscribe for 1000tk
        </button>
      )}
    </div>
  );
};

export default Profile;
