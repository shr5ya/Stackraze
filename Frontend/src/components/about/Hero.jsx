import React from "react";
import { motion } from "framer-motion";
import community from "../../assets/community.png";
import { A, B, C } from "../../assets/about/index";

const avatarVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: 0.3 + i * 0.12, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

function Hero() {
  return (
    <div className="px-6 lg:px-20 py-10">
      {/* Hero Main Text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col justify-center items-center text-center hero-animate"
      >
        
        {/* Top Line */}
        <p className="font-semibold text-xl sm:text-2xl lg:text-3xl text-zinc-600 tracking-wider dark:text-zinc-300">
          Get your problems solved
        </p>

        {/* Main Heading Section - Optimized for Mobile */}
        <div className="mt-6 flex flex-col items-center justify-center gap-2 
                        sm:flex-row sm:flex-wrap sm:gap-4
                        text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
                        font-bold text-zinc-900 dark:text-zinc-100">
          
          <p className="leading-tight">Start connecting with</p>

          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <motion.img
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              src={community}
              className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain drop-shadow-md"
              alt="Stackraze logo"
            />
            <p className="text-zinc-900 dark:text-white leading-tight">
              Stackraze
            </p>
          </div>
        </div>
      </motion.div>

      {/* Avatars Section */}
      <div className="mt-12">
        <div className="flex justify-center relative">
          {[
            { src: A, alt: "Avatar A", fallback: "F9D4D5", extra: "z-10" },
            { src: B, alt: "Avatar B", fallback: "C9E5FF", extra: "-ml-3 sm:-ml-4 z-10" },
            { src: C, alt: "Avatar C", fallback: "FFF5C1", extra: "-ml-3 sm:-ml-4" },
          ].map((avatar, i) => (
            <motion.img
              key={avatar.alt}
              src={avatar.src}
              alt={avatar.alt}
              variants={avatarVariants}
              initial="hidden"
              animate="visible"
              custom={i}
              className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
                         rounded-full border-4 border-white shadow-lg ${avatar.extra}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/80x80/${avatar.fallback}/333333?text=${avatar.alt.split(" ")[1]}`;
              }}
            />
          ))}
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex justify-center items-center mt-8 hero-animate"
        >
          <p className="tracking-widest text-sm sm:text-base md:text-lg lg:text-xl 
                        text-zinc-600 dark:text-zinc-400 text-center">
            Connect | Collaborate | Learn
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;