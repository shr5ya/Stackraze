import { ArrowUpRight, Code2, MapPin, Users, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    title: "Share Knowledge",
    description:
      "Post your learnings, discoveries, and projects. Help others grow by sharing what you know — from code snippets to deep dives.",
  },
  {
    number: "02",
    title: "Connect Locally",
    description:
      "Find developers near you using our map-based connect feature. Collaborate, pair-program, or just grab a coffee with someone in your city.",
  },
  {
    number: "03",
    title: "Grow Together",
    description:
      "Stay updated with the community newsletter, join discussions, and build meaningful connections with people who share your passion for tech.",
  },
];

export default function People() {
  return (
    <div className="bg-white dark:bg-black min-h-screen px-4 py-8 md:px-8 font-sans max-w-5xl mx-auto transition-colors duration-300">

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-zinc-100 leading-tight mb-8">
        Built By Developers, <br /> For Developers.
      </h1>

      {/* Top cards row */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">

        {/* Highlight Card */}
        <div className="w-full md:w-1/4 bg-pink-100 dark:bg-pink-400 rounded-2xl p-5 flex flex-col justify-between min-h-44">
          <p className="text-gray-900 font-bold text-base leading-snug">
            Learn, Share &amp; Grow with the Tech Community!
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Link
              to="/connect"
              className="bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition"
            >
              Explore
            </Link>
            <Link
              to="/connect"
              className="bg-white text-gray-900 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
            >
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Community Photo */}
        <div className="w-full md:w-2/5 rounded-2xl overflow-hidden min-h-52 md:min-h-0">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80"
            alt="Developers working together"
            className="w-full h-full object-cover grayscale dark:brightness-75"
          />
        </div>

        {/* Stats grid */}
        <div className="w-full md:flex-1 grid grid-cols-2 gap-3">
          <div className="bg-gray-100 dark:bg-zinc-900 rounded-xl p-4 flex flex-col gap-1">
            <Users size={20} className="text-gray-500 dark:text-zinc-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-zinc-100">100+</span>
            <span className="text-xs text-gray-500 dark:text-zinc-400">Community Members</span>
          </div>
          <div className="bg-gray-100 dark:bg-zinc-900 rounded-xl p-4 flex flex-col gap-1">
            <MapPin size={20} className="text-gray-500 dark:text-zinc-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-zinc-100">Local</span>
            <span className="text-xs text-gray-500 dark:text-zinc-400">Map-Based Connect</span>
          </div>
          <div className="bg-gray-100 dark:bg-zinc-900 rounded-xl p-4 flex flex-col gap-1">
            <Code2 size={20} className="text-gray-500 dark:text-zinc-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-zinc-100">Open</span>
            <span className="text-xs text-gray-500 dark:text-zinc-400">Source &amp; Free</span>
          </div>
          <div className="bg-gray-100 dark:bg-zinc-900 rounded-xl p-4 flex flex-col gap-1">
            <Lightbulb size={20} className="text-gray-500 dark:text-zinc-400" />
            <span className="text-2xl font-black text-gray-900 dark:text-zinc-100">Daily</span>
            <span className="text-xs text-gray-500 dark:text-zinc-400">Knowledge Sharing</span>
          </div>
        </div>

      </div>

      {/* Feature Listings */}
      <div className="divide-y divide-gray-200 dark:divide-zinc-800 mt-4">
        {features.map((item) => (
          <div
            key={item.number}
            className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8 py-5 hover:bg-gray-50 dark:hover:bg-zinc-900 transition px-2 rounded-lg cursor-pointer"
          >
            <span className="text-gray-400 dark:text-zinc-600 font-semibold text-sm sm:text-base sm:w-8 shrink-0">
              {item.number}
            </span>
            <span className="font-bold text-gray-900 dark:text-zinc-100 text-base sm:w-44 shrink-0">
              {item.title}
            </span>
            <p className="text-gray-400 dark:text-zinc-500 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}