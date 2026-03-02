import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#f6f6f6] dark:bg-black pt-16 pb-10 px-8 md:px-16 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between">
        <div className="mb-12 md:mb-0">
          <span className="text-2xl font-bold uppercase tracking-wide text-gray-900 dark:text-zinc-100">
            Anchor
          </span>
        </div>

        <div className="flex flex-col md:items-end w-full md:w-3/5 lg:w-1/2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10 w-full mb-16 text-sm">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-zinc-200 mb-5">Our Company</h3>
              <ul className="space-y-4 text-gray-600 dark:text-zinc-400">
                <li><Link to="/blog" className="hover:text-gray-900 dark:hover:text-zinc-100">Blog</Link></li>
                <li><Link to="/podcast" className="hover:text-gray-900 dark:hover:text-zinc-100">Podcast</Link></li>
                <li><Link to="/careers" className="hover:text-gray-900 dark:hover:text-zinc-100">Careers</Link></li>
                <li><Link to="/newsroom" className="hover:text-gray-900 dark:hover:text-zinc-100">Newsroom</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 dark:text-zinc-200 mb-5">Products</h3>
              <ul className="space-y-4 text-gray-600 dark:text-zinc-400">
                <li><Link to="/cut-flowers" className="hover:text-gray-900 dark:hover:text-zinc-100">Cut Flowers</Link></li>
                <li><Link to="/ornamental-plants" className="hover:text-gray-900 dark:hover:text-zinc-100">Ornamental Plants</Link></li>
                <li><Link to="/merchandising" className="hover:text-gray-900 dark:hover:text-zinc-100">Merchandising</Link></li>
                <li><Link to="/partner-resources" className="hover:text-gray-900 dark:hover:text-zinc-100">Partner Resources</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 dark:text-zinc-200 mb-5">Contact</h3>
              <ul className="space-y-4 text-gray-600 dark:text-zinc-400">
                <li><Link to="/faqs" className="hover:text-gray-900 dark:hover:text-zinc-100">FAQs</Link></li>
                <li><Link to="/contact" className="hover:text-gray-900 dark:hover:text-zinc-100">Contact</Link></li>
                <li><Link to="/about" className="hover:text-gray-900 dark:hover:text-zinc-100">About Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between w-full border-t border-gray-200 dark:border-zinc-800 pt-6">
            <p className="text-xs text-gray-500 dark:text-zinc-500 mb-4 sm:mb-0">
              ©{year} Anchor. All rights reserved.
            </p>

            <div className="flex space-x-5">
              {/* <a href="#" target="_blank" className="text-gray-500 dark:text-zinc-500 hover:text-[#1877F2]"><Facebook size={20} /></a>
              <a href="#" target="_blank" className="text-gray-500 dark:text-zinc-500 hover:text-[#0A66C2]"><Linkedin size={20} /></a>
              <a href="#" target="_blank" className="text-gray-500 dark:text-zinc-500 hover:text-[#FF0000]"><Youtube size={22} /></a>
              <a href="#" target="_blank" className="text-gray-500 dark:text-zinc-500 hover:text-[#1DB954]"><Spotify size={20} /></a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;