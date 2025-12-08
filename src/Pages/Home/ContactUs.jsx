import { motion } from "framer-motion";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactUs = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="px-6 lg:px-20 py-20 bg-gray-100">
      <motion.h2
        className="text-3xl lg:text-5xl font-bold text-center mb-16 text-gray-800"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Get in Touch
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Contact Info */}
        <motion.div
          data-aos="fade-right"
          className="space-y-6 text-gray-700"
        >
          <p className="text-lg">
            Have a question or want to report a general issue? Reach out to our support team and we will assist you promptly. Your feedback helps us improve the City-Fix platform and ensure a better city experience for everyone.
          </p>

          <div className="space-y-4">
            <p><span className="font-semibold">Email:</span> support@cityfix.com</p>
            <p><span className="font-semibold">Phone:</span> +880 123 456 789</p>
            <p><span className="font-semibold">Address:</span> 123 CityFix Lane, Dhaka, Bangladesh</p>
          </div>

          <p className="text-gray-600">
            We aim to respond to all inquiries within 24 hours.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          className="bg-white p-8 rounded-xl shadow-lg space-y-6"
          data-aos="fade-left"
        >
          <div>
            <label className="block font-medium mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#576BFE] outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#576BFE] outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Subject</label>
            <input
              type="text"
              placeholder="Issue or Inquiry"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#576BFE] outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Message</label>
            <textarea
              rows={5}
              placeholder="Describe your issue or feedback..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#576BFE] outline-none resize-none"
            />
          </div>

          <motion.button
            type="submit"
            className="w-full bg-[#576BFE] text-white font-semibold py-3 rounded-xl hover:bg-[#6A7DFE] transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactUs;
