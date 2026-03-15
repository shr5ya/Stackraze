import React from "react";
import Phone from "../../assets/Phone.png";
import { apple, chatGpt, claude, deepseak, google, meta } from "../../assets/techlogos";

const logos = [
  { src: apple, invertDark: true, alt: "Apple" },
  { src: chatGpt, invertDark: true, alt: "ChatGPT" },
  { src: claude, invertDark: false, alt: "Claude" },
  { src: deepseak, invertDark: false, alt: "DeepSeek" },
  { src: google, invertDark: false, alt: "Google" },
  { src: meta, invertDark: false, alt: "Meta" },
];

// Duplicate 4x so the loop is seamless on any screen width
const track = [...logos, ...logos, ...logos, ...logos];

function LogoMarquee() {
  return (
    <section className="bg-white dark:bg-black transition-colors duration-300 overflow-hidden mt-40 lg:mt-70">

      {/* Label */}
      <div className="text-center pt-16 pb-8 px-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
          
        </span>
      </div>

      {/* Marquee strip — phone overlaps from below */}
      <div className="relative w-full overflow-visible pb-36 md:pb-44">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-black to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-black to-transparent z-10" />

        <div className="flex w-max animate-marquee">
          {track.map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              className={`h-10 mx-12 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity duration-300 object-contain${logo.invertDark ? " dark:invert" : ""}`}
            />
          ))}
        </div>

        {/* Phone — absolutely centred, overlapping the strip */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20">
          <img
            src={Phone}
            alt="Anchor app on phone"
            className="h-52 md:h-72 object-contain drop-shadow-2xl dark:drop-shadow-[0_20px_40px_rgba(255,255,255,0.08)]"
          />
        </div>
      </div>

      {/* Quote */}
      <div className="flex flex-col items-center px-6 pt-5 pb-16">
        <div className="max-w-2xl text-center">
          <p className="text-lg md:text-xl font-semibold text-gray-800 dark:text-zinc-200 leading-relaxed">
            Technology isn't something to hoard or gatekeep.
          </p>
          <p className="mt-3 text-sm md:text-base text-gray-500 dark:text-zinc-400 leading-relaxed">
            Discover what's happening in tech — what's new, what's trending, and
            how the world is evolving every day. At Anchor, we believe it's a
            tool meant to be shared, used thoughtfully, and leveraged to improve
            people's lives. Isn't our ability to create, collaborate, and uplift
            others what truly makes us human?
          </p>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-25%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

    </section>
  );
}

export default LogoMarquee;
