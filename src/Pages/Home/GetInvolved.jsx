import { motion } from "framer-motion";
import { Link } from "react-router";

const GetInvolved = () => {
  return (
    <div className="py-20 bg-gray-100 px-6 lg:px-20 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-10">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="lg:w-1/2 space-y-6"
      >
        <h2 className="text-3xl lg:text-5xl font-bold">
          Get Involved in Making Your City Better
        </h2>
        <p className="text-gray-700 text-lg">
          Join our community, report issues, and track progress. Together, we
          can make the city safer, cleaner, and more enjoyable for everyone.
        </p>
        <Link
          to="/all-issues"
          className="inline-block px-8 py-3 bg-[#576BFE] text-white rounded-xl font-semibold shadow-md hover:bg-[#6A7DFE] transition"
        >
          Report an Issue
        </Link>
      </motion.div>

      <motion.img
        src="/city-cleanup.png" // Replace with a relevant image from your assets
        alt="City cleanup"
        className="lg:w-1/2 rounded-xl shadow-lg"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
};

export default GetInvolved;
