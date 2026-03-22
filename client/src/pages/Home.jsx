import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';

const Home = () => {
  return (
    <main id="home-main" className="min-h-[calc(100vh-64px)] bg-white flex flex-col items-center justify-center p-6 sm:p-8">
      <section id="hero-section" aria-labelledby="hero-title" className="max-w-2xl w-full text-center py-8 sm:py-16">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 hover:rotate-0 transition-transform duration-500" style={{backgroundColor:'rgba(10,143,60,0.08)'}}>
          <FaGraduationCap className="text-5xl sm:text-6xl" style={{color:'#0A8F3C'}} aria-hidden="true" />
        </div>
        
        <h1 id="hero-title" className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
          Faculty <br className="sm:hidden" /> <span style={{color:'#0A8F3C'}}>Dues Portal</span>
        </h1>
        <div className="w-12 h-1.5 mx-auto mb-8 rounded-full" style={{backgroundColor:'#0A8F3C'}}></div>
        
        <p className="text-gray-500 mb-12 text-base sm:text-xl font-medium max-w-lg mx-auto leading-relaxed px-2">
          Fast, secure, and hassle-free payment system <br className="hidden sm:block"/> for all faculty students.
        </p>
        
        <div className="space-y-6 max-w-sm mx-auto px-4">
          <Link 
            to="/pay" 
            id="pay-dues-link"
            className="block w-full py-4 sm:py-5 px-8 text-white rounded-2xl font-black text-lg tracking-widest uppercase shadow-xl shadow-[#0A8F3C]/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 shadow-lg" style={{backgroundColor:'#0A8F3C'}}
          >
            Pay Your Dues
          </Link>
          <div className="text-[11px] sm:text-xs text-gray-400 mt-8 font-bold uppercase tracking-widest">
            <p className="flex items-center justify-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-300"></span> 
              Requires Matric Number & Passport
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            </p>
          </div>
        </div>
      </section>
      
      <footer className="mt-auto py-8 text-gray-400 text-sm font-medium">
        &copy; {new Date().getFullYear()} Faculty Connect
      </footer>
    </main>
  );
};

export default Home;
