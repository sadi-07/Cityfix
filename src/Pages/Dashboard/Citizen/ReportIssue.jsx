import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../Context/AuthProvider";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";

const backend = "http://localhost:3000";

const ReportIssue = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userIssuesCount, setUserIssuesCount] = useState(0);

  const { register, handleSubmit, reset, watch } = useForm();

  const image = watch("image"); // to preview if needed

  // Fetch total issues reported by this user
  useEffect(() => {
    const fetchUserIssues = async () => {
      try {
        const res = await axios.get(`${backend}/issues?email=${user.email}`);
        setUserIssuesCount(res.data.length);
      } catch (err) {
        console.log(err);
      }
    };
    if (user?.email) fetchUserIssues();
  }, [user]);

  const onSubmit = async (data) => {
    // Limit check for free users
    if (user.role !== "premium" && userIssuesCount >= 3) {
      alert("Free users can only report 3 issues. Please subscribe!");
      navigate("/dashboard/profile");
      return;
    }

    try {
      // Convert image to base64 if uploaded
      let imageURL = "";
      if (data.image && data.image[0]) {
        const file = data.image[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise((resolve) => {
          reader.onload = () => {
            imageURL = reader.result;
            resolve();
          };
        });
      }

      const issue = {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        image: imageURL,
        email: user.email,
        name: user.name,
        status: "Pending",
        priority: "Normal",
        upvoteCount: 0,
        upvotedBy: [],
        timeline: [
          {
            status: "Created",
            message: `Issue created by ${user.email}`,
            updatedBy: user.email,
            time: new Date(),
          },
        ],
      };

      await axios.post(`${backend}/issues`, issue);

      toast.success("Issue created successfully!");
      reset();
      navigate("/dashboard/my-issues");
    } catch (err) {
      console.log(err);
      toast.error("Failed to create issue");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Report New Issue</h2>

      {/* Free user limit */}
      {user.role !== "premium" && userIssuesCount >= 3 && (
        <p className="text-red-500 mb-4">
          Free users can only report 3 issues. Please subscribe!{" "}
          <button
            className="underline text-blue-500"
            onClick={() => navigate("/dashboard/profile")}
          >
            Subscribe
          </button>
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          className="p-2 border rounded"
          {...register("title", { required: true })}
        />
        <textarea
          placeholder="Description"
          className="p-2 border rounded"
          {...register("description", { required: true })}
        />

        <select
          className="p-2 border rounded"
          {...register("category", { required: true })}
        >
          <option value="">Select Category</option>
          <option value="Road">Road</option>
          <option value="Garbage">Garbage</option>
          <option value="Water">Water</option>
          <option value="Electricity">Electricity</option>
        </select>

        <input
          type="text"
          placeholder="Location"
          className="p-2 border rounded"
          {...register("location", { required: true })}
        />

        <input type="file" accept="image/*" {...register("image")} />

        <button
          type="submit"
          disabled={user.role !== "premium" && userIssuesCount >= 3}
          className="bg-green-600 text-white px-4 py-2 rounded mt-2 cursor-pointer"
        >
          Submit Issue
        </button>
      </form>
    </div>
  );
};

export default ReportIssue;
