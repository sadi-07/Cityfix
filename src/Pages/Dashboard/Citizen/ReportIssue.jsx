import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../Context/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { imageUpload } from "../../../Utils";
import Loading from "../../../Components/Shared/Loading";

const backend = "https://city-fix-server-one.vercel.app";

const ReportIssue = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [issueCount, setIssueCount] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // ================= FETCH FULL USER FROM DB =================
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.email) return;

      try {
        setUserLoading(true);
        const res = await fetch(`${backend}/users/${user.email}`);
        const data = await res.json();
        setDbUser(data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [user?.email]);

  // ================= FETCH USER ISSUE COUNT =================
  useEffect(() => {
    if (!user?.email) return;

    fetch(`${backend}/issues/count/${user.email}`)
      .then((res) => res.json())
      .then((data) => setIssueCount(data.count))
      .catch(() => {});
  }, [user?.email]);

  // ================= LOADER =================
  if (userLoading || !dbUser) {
    return <Loading />;
  }

  const isFreeUser = !dbUser.subscription?.status;
  const limitReached = isFreeUser && issueCount >= 3;

  // ================= SUBMIT HANDLER =================
  const onSubmit = async (data) => {
    if (limitReached) {
      return toast.error("Issue limit reached! Upgrade to Premium.");
    }

    setSubmitLoading(true);

    try {
      let imageURL = "";

      if (data.imageFile && data.imageFile.length > 0) {
        imageURL = await imageUpload(data.imageFile[0]);
      }

      const res = await fetch(`${backend}/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location,
          image: imageURL,
          userEmail: user.email,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        return toast.error(result.message || "Failed to create issue");
      }

      toast.success("Issue reported successfully!");
      reset();
      navigate("/dashboard/my-issues");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Report an Issue</h1>

      {/* FREE USER WARNING */}
      {limitReached && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded mb-6">
          You reached your free limit (3 issues).
          <button
            onClick={() => navigate("/dashboard/profile")}
            className="ml-4 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Upgrade to Premium
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg p-6 rounded-lg space-y-4"
      >
        {/* TITLE */}
        <div>
          <label className="font-bold text-lg">Issue Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full border p-2 rounded mt-1"
            disabled={limitReached}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-bold text-lg">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full border p-2 rounded mt-1 h-28"
            disabled={limitReached}
            required
          />
        </div>

        {/* CATEGORY */}
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

        {/* IMAGE */}
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

        {/* LOCATION */}
        <div>
          <label className="font-bold text-lg">Location</label>
          <input
            {...register("location", { required: true })}
            className="w-full border p-2 rounded mt-1"
            disabled={limitReached}
            required
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={submitLoading || limitReached}
          className={`w-full py-3 text-white rounded font-bold text-xl ${
            limitReached ? "bg-gray-400" : "btn-btn"
          }`}
        >
          {submitLoading ? "Submitting..." : "Submit Issue"}
        </button>
      </form>
    </div>
  );
};

export default ReportIssue;
