import { Wrench, MapPin, Bell, Users, Camera, Clock } from "lucide-react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const features = [
    {
        icon: <Wrench size={40} className="text-[#576BFE]" />,
        title: "Report City Issues",
        desc: "Easily report potholes, broken lights, garbage and more with a simple form."
    },
    {
        icon: <Clock size={40} className="text-[#576BFE]" />,
        title: "Track Progress",
        desc: "Follow the status of your reported issues from pending to resolved."
    },
    {
        icon: <Camera size={40} className="text-[#576BFE]" />,
        title: "Before & After Images",
        desc: "Authorities upload real proof of repairs with before/after photos."
    },
    {
        icon: <MapPin size={40} className="text-[#576BFE]" />,
        title: "Map View",
        desc: "View issues around your area with GPS-based mapping."
    },
    {
        icon: <Bell size={40} className="text-[#576BFE]" />,
        title: "Instant Alerts",
        desc: "Receive notifications when your issue is updated or resolved."
    },
    {
        icon: <Users size={40} className="text-[#576BFE]" />,
        title: "Community Support",
        desc: "Upvote issues so authorities prioritize what matters to residents."
    },
];

const Features = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-center my-10 text-gradient">
                Powerful Features for a Better City
            </h2>
            <div className="px-4 sm:px-6 lg:px-20 py-16 bg-gray-100 rounded-2xl">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            className="bg-white shadow-md rounded-xl p-6 text-center space-y-4"
                            data-aos="fade-up"
                            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                        >
                            <div className="flex justify-center mb-2">{f.icon}</div>
                            <h3 className="text-xl font-semibold">{f.title}</h3>
                            <p className="text-gray-600">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;
