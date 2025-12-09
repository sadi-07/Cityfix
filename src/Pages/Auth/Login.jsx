import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router";
import white from "../../assets/logo-white-removebg-preview.png";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Context/AuthProvider";
import toast from "react-hot-toast";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const { logInUser, GUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle Login
  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      setBtnLoading(true);

      await logInUser(email, password);

      toast.success("Login Successful!");
      navigate(from, { replace: true });

    } catch (err) {
      console.log("Login Error:", err);

      if (err.code === "auth/user-not-found") {
        toast.error("No user found with this email.");
        return;
      }

      if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password!");
        return;
      }

      if (err.code === "auth/invalid-email") {
        toast.error("Invalid email format.");
        return;
      }

      toast.error("Login failed. Try again.");
    } finally {
      setBtnLoading(false);
    }
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    try {
      setBtnLoading(true);
      await GUser();
      toast.success("Login Successful!");
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
      toast.error("Google login failed!");
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
          Welcome Back
        </motion.h2>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

          {/* Email */}
          <div>
            <label className="text-gray-700 dark:text-gray-300 font-medium">Email</label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email",
                  },
                })}
              />
              {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
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
                {...register("password", {
                  required: "Password is required",
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
            className={`w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold shadow-md mt-3 text-lg cursor-pointer ${
              btnLoading && "opacity-70 cursor-not-allowed"
            }`}
          >
            {btnLoading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="flex items-center my-6 opacity-60">
          <span className="grow border-b dark:border-gray-700"></span>
          <span className="mx-3 text-gray-500 dark:text-gray-300 text-sm">OR</span>
          <span className="grow border-b dark:border-gray-700"></span>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 flex items-center justify-center gap-3 bg-white rounded-lg shadow-md cursor-pointer text-lg font-semibold"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-6 h-6"
          />
          Continue with Google
        </button>

        <p className="text-center text-base text-gray-600 dark:text-gray-300 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
