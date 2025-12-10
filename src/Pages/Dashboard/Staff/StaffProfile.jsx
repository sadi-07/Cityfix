import React, { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthProvider";
import { useForm } from "react-hook-form";
import axios from "axios";

const backend = "http://localhost:3000";

const StaffProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      let photoURL = user.photoURL;

      // Handle new profile image
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

      // Update in backend
      await axios.patch(`${backend}/users/${user.email}`, updatedUser);

      // Update context
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Staff Profile</h2>

      <div className="flex items-center gap-4 mb-4">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt={user?.name}
          className="h-20 w-20 rounded-full object-cover border"
        />
        <div>
          <h3 className="text-xl font-semibold">{user?.name}</h3>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-gray-500">Role: {user?.role}</p>
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
    </div>
  );
};

export default StaffProfile;
