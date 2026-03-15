import Video from "../../assets/algyn_video.mp4";

function Section2() {
  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-16">

        {/* Left — Video */}
        <div className="w-70 sm:w-62 md:w-94 aspect-square shrink-0 flex justify-center items-center rounded-full overflow-hidden">
          <video
            src={Video}
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full object-cover "
          />
        </div>

        {/* Right — Text */}
        <div className="flex flex-col gap-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
            Our Mission
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-zinc-100 leading-snug">
            No developer should have to solve problems alone.
          </h2>
          <p className="text-base text-gray-500 dark:text-zinc-400 leading-relaxed">
            Algyñ is a developer community platform built to foster meaningful
            collaboration, continuous learning, and open-source innovation. We
            believe great ideas grow stronger when shared. Whether you're
            debugging a stubborn 2AM error, preparing for your next hackathon,
            exploring a new framework, or contributing to open source — Algyñ
            connects you with peers who are ready to build, learn, and grow
            alongside you.
          </p>
          <p className="text-base text-gray-500 dark:text-zinc-400 leading-relaxed">
            Our mission is simple: create a trusted space where developers can
            exchange knowledge, find teammates, solve real-world problems, and
            turn ambitious ideas into impactful projects — together.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Section2;
