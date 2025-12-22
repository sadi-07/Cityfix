import { motion } from "framer-motion";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";
import Logo from "./Logo";
import logoWhite from "../../assets/logo-white-removebg-preview.png"
import { Link } from "react-router";

const Footer = () => {
    useEffect(() => {
        AOS.init({ duration: 600, once: true });
    }, []);

    return (
        <footer className="bg-gray-900 text-white px-6 lg:px-20 py-16">
            
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                
                <Link to="/" className="mx-auto h-20 w-60">
                    <img className="h-20 w-50 mx-auto" src={logoWhite} alt="" />
                </Link>

                
                <p className="text-gray-300 max-w-sm mx-auto text-lg my-5">
                    Your city, cleaner, safer, smarter, together we make it better today.
                </p>
            </motion.div>

            
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
            >
                <div>
                    <h4 className="font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-gray-300">
                        <li>
                            <a href="#" className="hover:underline">
                                About Us
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Careers
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Blog
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Services</h4>
                    <ul className="space-y-2 text-gray-300">
                        <li>
                            <a href="#" className="hover:underline">
                                Report Issues
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Track Progress
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Community Support
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Maps & Alerts
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Resources</h4>
                    <ul className="space-y-2 text-gray-300">
                        <li>
                            <a href="#" className="hover:underline">
                                FAQs
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Guides
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Help Center
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Privacy Policy
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Follow Us</h4>
                    <div className="flex gap-4 mt-2">
                        <Facebook className="cursor-pointer hover:text-primary" />
                        <Twitter className="cursor-pointer hover:text-primary" />
                        <Instagram className="cursor-pointer hover:text-primary" />
                        <Github className="cursor-pointer hover:text-primary" />
                    </div>
                </div>
            </motion.div>


            <motion.div
                className="border-t border-gray-700 pt-6 text-center text-gray-400"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                © 2025 City-Fix. All rights reserved.
            </motion.div>
        </footer>
    );
};

export default Footer;
