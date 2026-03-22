import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex justify-between items-center">
        
        {/* Left Side: UNIPORT Logo & Text */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link to="/" className="flex-shrink-0 hover:scale-105 transition-transform duration-300">
            <img 
              src="/UNIPORT-LOGO-PNG.png" 
              alt="UNIPORT Logo" 
              className="h-10 w-auto sm:h-14 object-contain drop-shadow-sm" 
            />
          </Link>
          <div className="hidden md:block">
            <h1 className="text-lg lg:text-xl font-black text-gray-900 leading-tight uppercase tracking-tight">University of <br/> Port Harcourt</h1>
            <p className="text-[10px] lg:text-xs text-[#0A8F3C] font-bold uppercase tracking-widest mt-0.5">Faculty Connect</p>
          </div>
        </div>

        {/* Center/Mobile Title */}
        <div className="md:hidden flex-grow text-center px-1">
            <h1 className="text-sm font-black text-gray-900 leading-tight uppercase tracking-tighter">Faculty <span className="text-[#0A8F3C]">Dues</span></h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Portal</p>
        </div>

        {/* Right Side: NACOS Logo & Text */}
        <div className="flex items-center space-x-2 sm:space-x-4">
           <div className="hidden md:block text-right">
            <h1 className="text-base lg:text-lg font-black text-gray-900 leading-tight uppercase tracking-tight">NACOS <br/> Chapter</h1>
            <p className="text-[10px] lg:text-xs text-[#0A8F3C] font-bold uppercase tracking-widest mt-0.5">Dues Portal</p>
          </div>
          <Link to="/" className="flex-shrink-0 hover:scale-105 transition-transform duration-300 relative group">
            <div className="absolute inset-0 rounded-full bg-[#0A8F3C] animate-ping opacity-10 group-hover:opacity-20"></div>
            <img 
              src="/NACOSLOGO.jpeg" 
              alt="NACOS Logo" 
              className="h-10 w-10 sm:h-14 sm:w-14 rounded-full object-cover shadow-md border-2 border-[#0A8F3C] relative z-10" 
            />
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;
