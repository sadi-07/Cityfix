import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Link } from "react-router";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import pothole from "../../assets/pothole.jpg"
import potholeFixed from "../../assets/pothole-fixed.png"
import garbage from "../../assets/garbage-road.jpeg"
import garbageFixed from "../../assets/garbage-fixed.png"
import light from "../../assets/broken-light.jpeg"
import lightFixed from "../../assets/fixed-light.png"

const Banner = () => {

    useEffect(() => {
        AOS.init({ duration: 900 });
    }, []);

    const slides = [
        {
            before: pothole,
            after: potholeFixed,
            title: "Pothole Repaired"
        },
        {
            before: garbage,
            after: garbageFixed,
            title: "Garbage Cleaned"
        },
        {
            before: light,
            after: lightFixed,
            title: "Streetlight Fixed"
        }
    ];

    return (
        <div className="w-full min-h-[75vh] gap-10 lg:gap-2 flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-20 lg:my-20">

            {/* LEFT SIDE */}
            <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 text-center lg:text-left space-y-5"
            >
                <motion.h1
                    className="text-4xl lg:text-6xl font-bold leading-tight"
                    whileHover={{ scale: 1.03 }}
                >
                    Fix Your City,
                    <span className="text-primary"> One Issue at a Time</span>
                </motion.h1>

                <p className="text-gray-600 text-lg">
                    Report problems in your city—potholes, garbage, streetlights—
                    and track how fast they get fixed by local authorities.
                </p>

                <motion.div whileTap={{ scale: 0.95 }}>
                    <Link
                        to="/all-issues"
                        className="inline-block px-8 py-3 text-white rounded-lg text-lg font-semibold shadow-md transition bg-primary hover:bg-secondary "
                    >
                        View All Issues
                    </Link>
                </motion.div>
            </motion.div>

            {/* RIGHT SIDE: SLIDER */}
            <div
                className="w-full lg:w-1/2 mt-10 lg:mt-0"
                data-aos="fade-left"
            >
                <Swiper
                    loop={true}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={1}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 150,
                        modifier: 2.5,
                    }}
                    autoplay={{
                        delay: 1500,
                        disableOnInteraction: false
                    }}
                    modules={[EffectCoverflow, Autoplay]}
                    className="w-full max-w-xl"
                >

                    {slides.map((item, idx) => (
                        <SwiperSlide
                            key={idx}
                            className="
                bg-white shadow-lg rounded-xl p-4 w-[260px] h-[550px] 
                flex flex-col gap-3 border border-gray-400 overflow-hidden
              "
                        >
                            <img
                                src={item.before}
                                alt="issue before"
                                className="w-full h-52 rounded-lg object-cover mb-3"
                            />
                            <img
                                src={item.after}
                                alt="issue after"
                                className="w-full h-52 rounded-lg object-cover"
                            />
                            <p className="text-center font-semibold text-gray-700 mt-2">
                                {item.title}
                            </p>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </div>
    );
};

export default Banner;
