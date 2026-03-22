import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';

const Home = () => {
  return (
    <main id="home-main" className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <section id="hero-section" aria-labelledby="hero-title" className="max-w-2xl w-full text-center py-10">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor:'rgba(10,143,60,0.05)'}}>
          <FaGraduationCap className="text-6xl" style={{color:'#0A8F3C'}} aria-hidden="true" />
        </div>
        
        <h1 id="hero-title" className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Faculty <span style={{color:'#0A8F3C'}}>Dues Portal</span>
        </h1>
        <div className="w-16 h-1 mx-auto mb-8 rounded-full" style={{backgroundColor:'#0A8F3C'}}></div>
        
        <p className="text-gray-600 mb-10 text-lg sm:text-xl font-medium max-w-lg mx-auto leading-relaxed">
          Fast, secure, and hassle-free payment system for all faculty students.
        </p>
        
        <div className="space-y-6 max-w-sm mx-auto">
          <Link 
            to="/pay" 
            id="pay-dues-link"
            className="block w-full py-4 px-8 text-white rounded-full font-bold text-lg tracking-wide shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:opacity-90" style={{backgroundColor:'#0A8F3C'}}
          >
            Pay Your Dues
          </Link>
          <div className="text-sm text-gray-500 mt-6 px-4">
            <p>Ensure you have your Matric Number and a passport photograph ready before starting.</p>
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
