import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { MapPin, Wrench, Camera } from "lucide-react";

const steps = [
    {
        icon: <MapPin size={50} className="text-[#576BFE]" />,
        title: "Report an Issue",
        desc: "Mark the location of potholes, garbage, broken streetlights, or other city problems."
    },
    {
        icon: <Wrench size={50} className="text-[#576BFE]" />,
        title: "Authorities Take Action",
        desc: "Local authorities receive your report and start fixing the issue quickly."
    },
    {
        icon: <Camera size={50} className="text-[#576BFE]" />,
        title: "Track Before & After",
        desc: "View photos and updates to see the progress and confirm the issue is resolved."
    },
];

const HowItWorks = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <div className="my-20 mx-4 lg:mx-0">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-center mb-10 text-gradient">
                How It Works
            </h2>
            <div className="px-6 lg:px-20 py-16 bg-gray-100 rounded-2xl">

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            className="bg-white shadow-md rounded-xl p-8 text-center space-y-4"
                            data-aos="fade-up"
                            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                        >
                            <div className="flex justify-center mb-4">{step.icon}</div>
                            <h3 className="text-xl font-semibold">{step.title}</h3>
                            <p className="text-gray-600">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
