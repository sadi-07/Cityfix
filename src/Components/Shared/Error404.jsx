import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const Error404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      
      <motion.img
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        src="https://i.imgur.com/qIufhof.gif"
        alt="404 Error"
        className="w-72 md:w-96 mb-6"
      />
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold text-center"
      >
        <span className="text-primary">404</span> — Page Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-gray-600 font-bold text-xl text-center mt-4"
      >
        Oops! Looks like this page doesn't exist.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Link
          to="/"
          className="btn mt-6 px-7 py-7 text-white rounded-lg shadow-md text-lg font-semibold transition"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default Error404;