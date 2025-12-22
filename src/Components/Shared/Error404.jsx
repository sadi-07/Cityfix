import { Link } from "react-router";
import { motion } from "framer-motion";

const Error404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-10 text-center">
      
      <motion.img
        src="https://media.tenor.com/Qxi2surCOLcAAAAM/slow-down-sign.gif" 
        alt="404 Not Found"
        className="w-80 h-80 mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
      />

      
      <motion.h1
        className="text-5xl font-bold mb-4 text-gray-800"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        404
      </motion.h1>
      <motion.p
        className="text-gray-600 mb-8 text-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Oops! The page you are looking for does not exist.
      </motion.p>

      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to="/"
          className="px-8 py-3 bg-primary text-white font-semibold rounded-xl text-xl shadow-md hover:bg-secondary transition"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default Error404;
