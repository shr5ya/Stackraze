import React from 'react';
import { Link, useParams } from 'react-router-dom';

const SettingsOptions = () => {
  const { tab } = useParams();

  const items = [
    { name: 'Account', path: 'update-account-data' },
    { name: 'Location', path: 'update-location' },
    // { name: 'Story', path: 'story' },
    // { name: 'People', path: 'people' },
    // { name: 'Newsroom', path: 'newsroom' },
  ];

  return (
    <>
      {/* Desktop Settings Sidebar - Taking the EXACT position of the global Sidebar but with minimal serif styling */}
      <aside
        className="hidden md:flex fixed top-14 pb-10  border-r border-gray-200 dark:border-gray-800 transition-all duration-500 ease-out flex-col w-64 h-screen z-30"
        style={{ right: "calc(50% + 18rem + 1.25rem)" }}
      >
        <ul className="flex flex-col pt-8 px-6">
          {items.map((item, index) => {
            const itemPath = item.path;
            const isActive = tab === itemPath || (!tab && index === 0);

            return (
              <li key={index} className="group flex flex-col">
                <Link
                  to={`/settings/${itemPath}`}
                  className={`w-full pl-2 py-1 my-1 text-left hover:bg-gray-100 hover:dark:bg-neutral-900 rounded-2xl ${isActive ? 'bg-gray-100 dark:bg-zinc-900':""}`}
                >
                  <span className={`text-[20px] font-serif tracking-wide transition-opacity ${isActive ? 'text-black dark:text-white opacity-100' : 'text-black dark:text-white opacity-80 group-hover:opacity-100'}`}>
                    {item.name}
                  </span>
                </Link>

                {/* Divider*/}
                {index !== items.length - 1 && (
                  <div className="w-full h-px bg-gray-200 dark:bg-gray-800"></div>
                )}
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Mobile Settings Nav (styled minimally to match serif theme) */}
      <div className="md:hidden w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 flex items-center overflow-x-auto px-6 py-4 gap-6 sticky pt-15 z-40 scrollbar-hide">
          {items.map((item, index) => {
            const itemPath = item.path;
            const isActive = tab === itemPath || (!tab && index === 0);
            return (
              <Link
                key={index}
                to={`/settings/${itemPath}`}
                className={`shrink-0 text-xl font-serif transition-colors ${isActive ? 'text-black dark:text-white font-medium border-b border-black dark:border-white pb-1' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
              >
                {item.name}
              </Link>
            );
          })}
      </div>
    </>
  );
};

export default SettingsOptions;