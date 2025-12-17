import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../Context/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { imageUpload } from "../../../Utils";

const backend = "http://localhost:3000";

const ReportIssue = () => {
  const { user } = useContext(AuthContext);
  const [issueCount, setIssueCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();

  // Fetch user's issue count
  useEffect(() => {
    if (user?.email) {
      fetch(`${backend}/issues/count/${user.email}`)
        .then((res) => res.json())
        .then((data) => setIssueCount(data.count));
    }
  }, [user]);

  const isFreeUser = !user?.subscription?.status;
  const limitReached = isFreeUser && issueCount >= 3;

  // Submit Handler
  const onSubmit = async (data) => {
    if (limitReached) {
      return toast.error("Issue limit reached! Please upgrade to Premium.");
    }

    setLoading(true);

    try {
      let imageURL = "";

      // If user uploaded an image file — upload it to ImgBB
      if (data.imageFile && data.imageFile.length > 0) {
        const file = data.imageFile[0];
        imageURL = await imageUpload(file);
      }

      const res = await fetch(`${backend}/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location,
          image: imageURL, // saved URL from ImgBB
          userEmail: user.email,
          status: "Pending",
          timeline: [
            {
              message: "Issue created",
              time: new Date(),
            },
          ],
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Issue reported successfully!");
        reset();
        navigate("/dashboard/my-issues");
      } else {
        toast.error(result.message || "Failed to create issue");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while submitting");
    } finally {
      setLoading(false);
    }
  };

  console.log(user.email)

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Report an Issue</h1>

      {/* Free User Limit Warning */}
      {limitReached && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded mb-6">
          You reached your free limit (3 issues).
          <button
            onClick={() => navigate("/dashboard/profile")}
            className="ml-4 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
          >
            Upgrade to Premium
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg p-6 rounded-lg space-y-4"
      >
        {/* Title */}
        <div>
          <label className="font-bold text-lg">Issue Title</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="w-full border p-2 rounded mt-1"
            placeholder="Road broken, water problem..."
            disabled={limitReached}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-bold text-lg">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full border p-2 rounded mt-1 h-28"
            placeholder="Describe the issue..."
            disabled={limitReached}
            required
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="font-bold text-lg">Category</label>
          <select
            {...register("category", { required: true })}
            className="w-full border p-2 rounded mt-1"
            disabled={limitReached}
            required
          >
            <option value="">Select Category</option>
            <option value="Road">Road</option>
            <option value="Electricity">Electricity</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Garbage">Garbage</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="font-bold text-lg">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("imageFile")}
            className="w-full border p-2 rounded mt-1"
            disabled={limitReached}
          />
        </div>

        {/* Location */}
        <div>
          <label className="font-bold text-lg">Location</label>
          <input
            type="text"
            {...register("location", { required: true })}
            className="w-full border p-2 rounded mt-1"
            placeholder="Your area / street name"
            disabled={limitReached}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || limitReached}
          className={`w-full py-3 text-white rounded font-bold cursor-pointer text-xl ${
            limitReached
              ? "bg-gray-400 cursor-not-allowed"
              : "btn-btn"
          }`}
        >
          {loading ? "Submitting..." : "Submit Issue"}
        </button>
      </form>
    </div>
  );
};

export default ReportIssue;
