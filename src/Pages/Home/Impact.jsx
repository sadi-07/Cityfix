import { motion } from "framer-motion";

const stats = [
  { value: "1200+", label: "Issues Fixed" },
  { value: "800+", label: "Active Users" },
  { value: "50+", label: "Neighborhoods Covered" },
];

const Impact = () => {
  return (
    <div className="py-16 bg-gradient text-white px-6 lg:px-20 text-center rounded-2xl mx-4 lg:mx-0">
      <h2 className="text-4xl lg:text-5xl font-extrabold mb-12">
        Our Community Impact
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="bg-gray-100 bg-opacity-10 rounded-xl p-6 text-gray-900"
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            data-aos="fade-up"
          >
            <h3 className="text-4xl font-bold text-secondary">{stat.value}</h3>
            <p className="mt-2 font-semibold text-gray-600 text-base">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Impact;
