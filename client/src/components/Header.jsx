import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/UNIPORT-LOGO-PNG.png" 
              alt="UNIPORT" 
              className="h-10 w-auto" 
            />
            <div className="hidden sm:block">
              <h4 className="text-xs font-bold text-gray-900 leading-none uppercase tracking-tight">University of <br/> Port Harcourt</h4>
              <p className="text-[9px] text-primary font-bold uppercase tracking-widest mt-0.5">Faculty Connect</p>
            </div>
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
           <div className="hidden lg:block text-right pr-2">
              <h4 className="text-xs font-bold text-gray-900 leading-none uppercase tracking-tight">NACOS <br/> UNIPORT</h4>
           </div>
           <Link to="/" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-gray-200 overflow-hidden">
              <img 
                src="/NACOSLOGO.jpeg" 
                alt="NACOS" 
                className="w-full h-full object-cover" 
              />
           </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
