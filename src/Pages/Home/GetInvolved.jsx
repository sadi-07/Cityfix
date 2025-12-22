import { motion } from "framer-motion";
import { Link } from "react-router";
import cleanImage from "../../assets/cleanImage.jpeg"

const GetInvolved = () => {
  return (
    <div className="py-20 bg-gray-100 px-6 lg:px-20 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-10 my-20 rounded-2xl mx-4 lg:mx-0">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="lg:w-1/2 space-y-6"
      >
        <h2 className="text-4xl lg:text-5xl font-bold text-gradient">
          Get Involved in Making Your City Better
        </h2>
        <p className="text-gray-700 text-lg">
          Join our community, report issues, and track progress. Together, we
          can make the city safer, cleaner, and more enjoyable for everyone.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-8 py-3 bg-primary text-white text-lg rounded-lg font-semibold shadow-md hover:bg-secondary transition"
        >
          Open Your Dashboard
        </Link>
      </motion.div>

      <motion.img
        src={cleanImage}
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
