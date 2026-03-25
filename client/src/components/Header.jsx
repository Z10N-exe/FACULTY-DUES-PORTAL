import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaShieldAlt } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();
  const isPayPage = location.pathname.includes('/pay');

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 shadow-sm overflow-hidden">
      {/* Top Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-green-400 to-primary/80"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center transition-all duration-300">
        
        {/* Left Side: Brand Identity */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3 group transition-transform active:scale-95">
             <div className="relative">
                <div className="absolute -inset-1 bg-primary/20 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity"></div>
                <img 
                  src="/UNIPORT-LOGO-PNG.png" 
                  alt="UNIPORT" 
                  className="h-10 w-auto sm:h-12 object-contain relative z-10 drop-shadow-sm transition-transform group-hover:rotate-6" 
                />
             </div>
             <div className="hidden sm:block">
                <h4 className="text-sm font-black text-gray-900 leading-none uppercase tracking-tighter italic">University of <br/> Port Harcourt</h4>
                <p className="text-[9px] text-primary font-black uppercase tracking-[0.3em] mt-1 transform group-hover:translate-x-1 transition-transform">Faculty of Computing</p>
             </div>
          </Link>
        </div>

        {/* Center: Dynamic Title (Mobile Optimized) */}
        {!isPayPage ? (
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.6em] mb-1">Official Portal</span>
             <h2 className="text-lg font-black italic uppercase tracking-widest text-gray-900 leading-none">NACOS <span className="text-primary italic">Connect</span></h2>
          </div>
        ) : (
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center space-x-2 px-6 py-2 bg-secondary/50 rounded-full border border-primary/10">
             <FaShieldAlt className="text-primary text-xs" />
             <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Secure Clearance</span>
          </div>
        )}

        {/* Right Side: Faculty Pride */}
        <div className="flex items-center space-x-4">
           <div className="hidden lg:block text-right pr-2">
              <h4 className="text-sm font-black text-gray-900 leading-none uppercase tracking-tighter italic italic">Association <br className="hidden"/> Excellence</h4>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">NACOS UNIPORT CHAPTER</p>
           </div>
           <Link to="/" className="relative group transition-all active:scale-90">
             <div className="absolute inset-0 bg-primary rounded-2xl blur-lg group-hover:scale-110 opacity-10 transition-transform"></div>
             <div className="relative z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-2xl border-2 border-primary/20 overflow-hidden shadow-inner group-hover:border-primary transition-colors">
                <img 
                  src="/NACOSLOGO.jpeg" 
                  alt="NACOS" 
                  className="w-full h-full object-cover grayscale-0 group-hover:scale-110 transition-transform duration-500" 
                />
             </div>
           </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
