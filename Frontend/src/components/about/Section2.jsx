import { motion } from "framer-motion";
import Video from "../../assets/algyn_video3.mp4";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function Section2() {
  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-16">

        {/* Left — Video */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="w-70 sm:w-62 md:w-94 aspect-square shrink-0 flex justify-center items-center rounded-full overflow-hidden"
        >
          <video
            src={Video}
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full object-cover "
          />
        </motion.div>

        {/* Right — Text */}
        <div className="flex flex-col gap-5">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            custom={0}
            className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500"
          >
            Our Mission
          </motion.span>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            custom={1}
            className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-zinc-100 leading-snug"
          >
            No developer should have to solve problems alone.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            custom={2}
            className="text-base text-gray-500 dark:text-zinc-400 leading-relaxed"
          >
            Algyñ is a developer community platform built to foster meaningful
            collaboration, continuous learning, and open-source innovation. We
            believe great ideas grow stronger when shared. Whether you're
            debugging a stubborn 2AM error, preparing for your next hackathon,
            exploring a new framework, or contributing to open source — Algyñ
            connects you with peers who are ready to build, learn, and grow
            alongside you.
          </motion.p>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            custom={3}
            className="text-base text-gray-500 dark:text-zinc-400 leading-relaxed"
          >
            Our mission is simple: create a trusted space where developers can
            exchange knowledge, find teammates, solve real-world problems, and
            turn ambitious ideas into impactful projects — together.
          </motion.p>
        </div>

      </div>
    </div>
  );
}

export default Section2;

