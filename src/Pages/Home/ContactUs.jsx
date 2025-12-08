import { motion } from "framer-motion";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactUs = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="px-6 lg:px-20 py-20">
      <motion.h2
        className="text-5xl lg:text-6xl font-bold text-center mb-12 text-gray-800"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Contact Us
      </motion.h2>

      <motion.div
        className="max-w-3xl mx-auto space-y-8 text-center text-gray-700"
        data-aos="fade-up"
      >
        <p className="text-lg">
          Have a question, suggestion, or need assistance? We are here to help! City-Fix connects citizens with local authorities to improve urban life. Reach out to us and let’s make your city a better place together.
        </p>

        <div className="space-y-4">
          <p>
            <span className="font-semibold text-gray-800">Email:</span> support@cityfix.com
          </p>
          <p>
            <span className="font-semibold text-gray-800">Phone:</span> +880 123 456 789
          </p>
          <p>
            <span className="font-semibold text-gray-800">Address:</span> 123 CityFix Lane, Dhaka, Bangladesh
          </p>
        </div>

        <p className="text-gray-600">
          Our team strives to respond to all inquiries within 24 hours. Thank you for helping us improve your city!
        </p>
      </motion.div>
    </section>
  );
};

export default ContactUs;
