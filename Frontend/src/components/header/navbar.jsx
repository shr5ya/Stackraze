import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedThemeToggler } from '../ui/animated-theme-toggler';
import Profile from './Profile';
import Logo from "../../assets/stackcraze.png";

const Navbar = () => {
  return (
    <nav className='fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-2 px-4 md:px-10 lg:px-20 backdrop-blur-4xl bg-gradient-to-b from-white/80 to-transparent dark:from-black/20 dark:to-transparent'>

      {/* Left logo */}
      <Link to="/">
        <div className='flex gap-4 items-center'>
          <div className="md:pl-10 flex items-center gap-2">
            <img src={Logo} className='w-30
             ' alt="logo" />
            {/* <p className="text-2xl font-semibold text-black dark:text-white">Stackraze</p> */}
          </div>
        </div>
      </Link>

      {/* Right side */}
      <div className='flex items-center gap-3 md:gap-6'>
        <AnimatedThemeToggler />
        <Profile />
      </div>
    </nav>
  );
};

export default Navbar;

