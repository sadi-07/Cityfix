import { useForm } from "react-hook-form";
import { useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../../Context/AuthProvider";
import { imageUpload } from "../../../Utils";

const ReportIssue = () => {
    const { user } = useContext(AuthContext);

    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        const imageFile = data.image[0];
        const imageURL = await imageUpload(imageFile);

        const issue = {
            title: data.title,
            description: data.description,
            category: data.category,
            image: imageURL,
            location: data.location,
            priority: "normal",
            status: "pending",
            upvotes: [],
            createdAt: new Date(),
            submittedBy: {
                name: user.displayName,
                email: user.email,
                photo: user.photoURL
            },
            timeline: [
                {
                    status: "Pending",
                    message: "Issue reported by citizen",
                    updatedBy: user.email,
                    date: new Date()
                }
            ]
        };

        const res = await axios.post("http://localhost:3000/issues", issue);

        if (res.data.insertedId) {
            toast.success("Issue submitted successfully!");
            reset();
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 shadow-lg bg-white rounded">
            <h2 className="text-2xl font-bold mb-4">Report an Issue</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <input {...register("title")} className="input" placeholder="Issue Title" required />

                <textarea {...register("description")} className="textarea" placeholder="Describe the issue" required />

                <select {...register("category")} className="input" required>
                    <option value="">Select Category</option>
                    <option>Road</option>
                    <option>Water</option>
                    <option>Electricity</option>
                    <option>Garbage</option>
                    <option>Streetlight</option>
                    <option>Footpath</option>
                </select>

                <input type="file" {...register("image")} required />

                <input {...register("location")} className="input" placeholder="Location" required />

                <button className="btn w-full bg-primary text-white">Submit Issue</button>
            </form>
        </div>
    );
};

export default ReportIssue;
