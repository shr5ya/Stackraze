import React from "react";
import { motion } from "framer-motion";
import community from "../../assets/community.png";
import { A, B, C } from "../../assets/about/index";

function Hero() {
  return (
    <div className="px-6 lg:px-20">

      {/* Hero Main Text */}
      <div className="flex flex-col justify-center items-center text-center hero-animate">

        {/* Top Line */}
        <p className="font-semibold text-xl sm:text-2xl lg:text-3xl text-zinc-600 tracking-wider dark:text-zinc-300">
          Get your problems solved
        </p>

 {/* Main Heading Section - Balanced & Impactful */}
<div className="flex flex-wrap justify-center items-center gap-3 mt-6 
                text-2xl sm:text-4xl md:text-5xl lg:text-6xl 
                font-bold text-zinc-900 dark:text-zinc-100">
  
  <p>Start connecting with</p>

  <motion.img
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    src={community}
    /* Scaled up to h-24 to match the 6xl text weight */
    className="h-12 sm:h-18 md:h-22 lg:h-24 w-auto object-contain drop-shadow-md mx-2"
    alt="Stackraze logo"
  />

  <p className="text-zinc-900 dark:text-white">
    Stackraze
  </p>
</div>
</div>

      {/* Avatars Section */}
      <div className="mt-10">
        <div className="flex justify-center relative">
          <img
            src={A}
            alt="Avatar A"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
                       rounded-full border-4 border-white shadow-lg z-10"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/80x80/F9D4D5/333333?text=A";
            }}
          />

          <img
            src={B}
            alt="Avatar B"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
                       rounded-full border-4 border-white shadow-lg 
                       -ml-3 sm:-ml-4 z-10"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/80x80/C9E5FF/333333?text=B";
            }}
          />

          <img
            src={C}
            alt="Avatar C"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
                       rounded-full border-4 border-white shadow-lg 
                       -ml-3 sm:-ml-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/80x80/FFF5C1/333333?text=C";
            }}
          />
        </div>

        {/* Bottom Text */}
        <div className="flex justify-center items-center mt-8 hero-animate">
          <p className="tracking-widest text-sm sm:text-base md:text-lg lg:text-xl 
                        text-zinc-600 dark:text-zinc-400 text-center">
            Connect | Collaborate | Learn
          </p>
        </div>
      </div>

    </div>
  );
}

export default Hero;