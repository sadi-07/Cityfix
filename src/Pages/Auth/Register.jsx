import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Image as ImageIcon } from "lucide-react";
import { Link, replace, useLocation, useNavigate } from "react-router";
import Logo from "../../Components/Shared/Logo";
import white from "../../assets/logo-white-removebg-preview.png"
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Context/AuthProvider";
import toast from "react-hot-toast";
import axios from "axios";
import { imageUpload } from "../../Utils";

const Register = () => {
    const [showPass, setShowPass] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    const { createUser, updateUserProfile, GUser, loading } = useContext(AuthContext);
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state || '/'

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        const { name, image, email, password } = data;

        const imageFile = image[0]
        // const formData = new FormData()
        // formData.append('image', imageFile)

        try {
            setBtnLoading(true);

            // Upload image to imgBB
            // const data = await axios.post(
            //     `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
            //     formData
            // );

            const imageURL = await imageUpload(imageFile);

            
            const result = await createUser(email, password);

            
            await updateUserProfile(name, imageURL, "citizen");

            
            await axios.post("https://city-fix-server-one.vercel.app/users", {
                name,
                email,
                photo: imageURL,
                role: "citizen",
                createdAt: new Date()
            });

            
            toast.success("Signup Successful!");
            navigate(from, { replace: true });


        } catch (err) {
            console.log("Registration Error:", err);

            
            if (err.code === "auth/email-already-in-use") {
                toast.error("This email is already registered!");
                return;
            }

            
            if (err.code === "auth/weak-password") {
                toast.error("Password must be at least 6 characters.");
                return;
            }

            
            if (err.code === "auth/invalid-email") {
                toast.error("Invalid email format.");
                return;
            }

            
            if (err.response && err.response.data) {
                toast.error(err.response.data?.error?.message || "Image upload failed!");
                return;
            }

            
            if (err.message === "Network Error") {
                toast.error("Network error. Please check your internet.");
                return;
            }

            
            toast.error("Something went wrong. Try again.");
        }
        finally {
            setBtnLoading(false);
        }
    }

    const handleGoogleSignup = async () => {
        try {
            setBtnLoading(true);
            const result = await GUser();

            const user = result.user;

            
            await updateUserProfile(
                user.displayName,
                user.photoURL
            );

            
            await axios.post("https://city-fix-server-one.vercel.app/users", {
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                role: "citizen",
                createdAt: new Date()
            });

            toast.success("Signup Successful!");
            navigate(from, { replace: true });


        } catch (err) {
            console.log("Google Signup Error:", err);

            if (err.code === "auth/popup-closed-by-user") {
                toast.error("Popup closed before signing in.");
                return;
            }

            toast.error("Google signup failed. Try again.");
        } finally {
            setBtnLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient py-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-200 dark:border-gray-700"
            >
                <motion.h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
                    <Link to="/">
                        <img className="h-20 w-50 mx-auto mb-8" src={white} alt="" />
                    </Link>
                    Create an Account
                </motion.h2>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                    {/* Full Name */}
                    <div>
                        <label className="text-gray-700 dark:text-gray-300 font-medium">Full Name</label>
                        <div className="relative mt-2">
                            <User className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
                                {...register('name', {
                                    required: 'Name is required',
                                    maxLength: {
                                        value: 20,
                                        message: 'Name must contain less than 20 characters'
                                    },
                                })}
                            />
                            {errors.name && (
                                <p className="text-red-500 mt-1">{errors.name.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="text-gray-700 dark:text-gray-300 font-medium">Upload Photo</label>
                        <div className="relative mt-2">
                            <ImageIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="file"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                                {...register('image')}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-gray-700 dark:text-gray-300 font-medium">Email</label>
                        <div className="relative mt-2">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Please enter a valid email address',
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-gray-700 dark:text-gray-300 font-medium">Password</label>
                        <div className="relative mt-2">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full pl-10 pr-12 py-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be atleast 6 characters'
                                    }
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                            {errors.password && (
                                <p className="text-red-500 mt-1">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold shadow-md mt-3 text-lg cursor-pointer 
                            ${btnLoading && "opacity-70 cursor-not-allowed"}`}
                    >
                        {btnLoading ? "Loading..." : "Register"}
                    </button>
                </form>

                <div className="flex items-center my-6 opacity-60">
                    <span className="grow border-b dark:border-gray-700"></span>
                    <span className="mx-3 text-gray-500 dark:text-gray-300 text-sm">OR</span>
                    <span className="grow border-b dark:border-gray-700"></span>
                </div>

                {/* Google Login */}
                <button
                    onClick={handleGoogleSignup}
                    disabled={btnLoading}
                    className={`w-full py-3 flex items-center justify-center gap-3 bg-white rounded-lg shadow-md cursor-pointer text-lg font-semibold
        ${btnLoading && "opacity-70 cursor-not-allowed"}`}
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        className="w-6 h-6"
                    />
                    {btnLoading ? "Loading..." : "Continue with Google"}
                </button>


                <p className="text-center text-base text-gray-600 dark:text-gray-300 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
