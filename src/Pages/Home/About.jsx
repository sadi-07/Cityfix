import { motion } from "framer-motion";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const keyPoints = [
  {
    title: "Empower Residents",
    description: "City-Fix empowers citizens to actively participate in improving their urban environment. Residents can easily report issues such as potholes, broken streetlights, or overflowing garbage bins, ensuring their concerns are heard and addressed promptly by local authorities. The platform provides a simple interface for submitting reports with details, location, and optional images, fostering engagement and accountability. By giving residents a voice, City-Fix strengthens community involvement and encourages proactive efforts to make neighborhoods cleaner, safer, and more livable for everyone."
  },
  {
    title: "Transparent Tracking",
    description: "City-Fix allows users to track the progress of reported issues in real-time. Notifications inform residents when a problem is under review, being addressed, or completed. This transparency builds trust between citizens and authorities, reducing frustration from delays. Users can view updates, timelines, and responsible teams, ensuring accountability. Transparent tracking motivates citizens to report more issues, as they can see tangible results of their actions, creating a sense of satisfaction and reinforcing a culture of active civic participation."
  },
  {
    title: "Community Engagement",
    description: "The platform encourages collaboration among residents by enabling them to upvote issues, share concerns, and highlight critical problems affecting multiple people. This feature prioritizes the most pressing matters for authorities, ensuring effective resource allocation. City-Fix fosters dialogue between citizens and officials, helping communities work together to improve their environment. Active engagement strengthens civic responsibility and ensures that urban problems are addressed in a fair and organized manner."
  },
  {
    title: "Verified Solutions",
    description: "City-Fix provides accountability through visual proof. Authorities can upload before-and-after images of completed repairs or cleanups, allowing residents to verify that their reported issues have been addressed properly. This feature builds trust in the system and encourages users to continue reporting issues, knowing that actions are taken seriously. Visual confirmation also helps municipalities monitor progress, evaluate performance, and plan future improvements efficiently."
  },
  {
    title: "Educate & Inspire",
    description: "City-Fix goes beyond reporting issues by educating residents on responsible urban behavior. Tips, guides, and articles inform users about proper waste disposal, road safety, and public property care. By promoting awareness, the platform encourages proactive participation, helping prevent recurring issues and creating a culture of shared responsibility. Informed and engaged citizens become active contributors to a cleaner, safer, and well-maintained city."
  },
];

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="px-6 lg:px-20 py-20">
      <motion.h2
        className="text-5xl lg:text-6xl font-bold text-left mb-16 text-gray-800"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        About <span className="text-gradient">City Fix</span>
      </motion.h2>

      <div className="space-y-12">
        {keyPoints.map((point, idx) => (
          <motion.div
            key={idx}
            className="p-8 bg-white rounded-xl shadow-lg border-l-4 border-[#576BFE] hover:shadow-2xl transition cursor-default"
            data-aos="fade-up"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-[#576BFE]">
              {point.title}
            </h3>
            <p className="text-gray-700 text-lg">{point.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default About;
