import React from "react";
import { Link } from "react-router-dom";

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#f6f6f6] dark:bg-black pt-16 pb-10 px-8 md:px-16 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between">

        {/* Brand */}
        <div className="mb-12 md:mb-0">
          <span className="text-2xl font-bold uppercase tracking-wide text-gray-900 dark:text-zinc-100">
            Stackraze
          </span>
        </div>

        {/* Right side */}
        <div className="flex flex-col md:items-end w-full md:w-3/5 lg:w-1/2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10 w-full mb-16 text-sm">

            {/* Platform */}
            <div>
              <h3 className="font-bold text-gray-800 dark:text-zinc-200 mb-5">Platform</h3>
              <ul className="space-y-4 text-gray-600 dark:text-zinc-400">
                <li><Link to="/" className="hover:text-gray-900 dark:hover:text-zinc-100">Home</Link></li>
                <li><Link to="/connect" className="hover:text-gray-900 dark:hover:text-zinc-100">Connect</Link></li>
                <li><Link to="/community" className="hover:text-gray-900 dark:hover:text-zinc-100">Community</Link></li>
                <li><Link to="/newsletter" className="hover:text-gray-900 dark:hover:text-zinc-100">Newsletter</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-gray-800 dark:text-zinc-200 mb-5">Support</h3>
              <ul className="space-y-4 text-gray-600 dark:text-zinc-400">
                <li><Link to="/about" className="hover:text-gray-900 dark:hover:text-zinc-100">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-gray-900 dark:hover:text-zinc-100">Contact</Link></li>
                <li><Link to="/contact" className="hover:text-gray-900 dark:hover:text-zinc-100">FAQs</Link></li>
              </ul>
            </div>

            {/* Social */}
            {/* <div>
              <h3 className="font-bold text-gray-800 dark:text-zinc-200 mb-5">Follow Us</h3>
              <ul className="space-y-4 text-gray-600 dark:text-zinc-400">
                <li>
                  <a href="https://github.com/shr5ya/Stackraze.git" target="_blank" rel="noopener noreferrer"
                  
                    className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-zinc-100">
                    <GitHubIcon /> GitHub
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-zinc-100">
                    <TwitterIcon /> Twitter / X
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-zinc-100">
                    <LinkedInIcon /> LinkedIn
                  </a>
                </li>
              </ul>
            </div> */}

          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full border-t border-gray-200 dark:border-zinc-800 pt-6">
            <p className="text-xs text-gray-500 dark:text-zinc-500 mb-4 sm:mb-0">
              © {year} Stackraze. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-500">
              Built for the developer community 
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;