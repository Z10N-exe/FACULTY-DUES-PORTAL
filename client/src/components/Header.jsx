import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md border-b-4 border-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        
        {/* Left Side: UNIPORT Logo & Text */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link to="/" className="flex-shrink-0 hover:scale-105 transition-transform">
            <img 
              src="/UNIPORT-LOGO-PNG.png" 
              alt="UNIPORT Logo" 
              className="h-12 w-auto sm:h-14 object-contain drop-shadow-sm" 
            />
          </Link>
          <div className="hidden md:block">
            <h1 className="text-xl font-black text-gray-900 leading-tight uppercase tracking-tight">University of <br/> Port Harcourt</h1>
            <p className="text-xs text-primary font-bold uppercase tracking-widest mt-0.5">Faculty Connect</p>
          </div>
        </div>

        {/* Center/Mobile Title */}
        <div className="md:hidden flex-grow text-center px-2">
            <h1 className="text-base font-black text-gray-900 leading-tight uppercase tracking-tight">Faculty Dues</h1>
        </div>

        {/* Right Side: NACOS Logo & Text */}
        <div className="flex items-center space-x-3 sm:space-x-4">
           <div className="hidden md:block text-right">
            <h1 className="text-lg font-black text-gray-900 leading-tight uppercase tracking-tight">NACOS <br/> Chapter</h1>
            <p className="text-xs text-primary font-bold uppercase tracking-widest mt-0.5">Dues Portal</p>
          </div>
          <Link to="/" className="flex-shrink-0 hover:scale-105 transition-transform relative">
            <div className="absolute inset-0 rounded-full bg-primary animate-pulse opacity-20"></div>
            <img 
              src="/NACOSLOGO.jpeg" 
              alt="NACOS Logo" 
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover shadow-md border-2 border-primary relative z-10" 
            />
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;
