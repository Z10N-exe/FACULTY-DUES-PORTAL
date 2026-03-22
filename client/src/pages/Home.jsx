import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center py-10">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-primary/5">
          <FaGraduationCap className="text-6xl text-primary" />
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Faculty <span className="text-primary">Dues Portal</span>
        </h1>
        <div className="w-16 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
        
        <p className="text-gray-600 mb-10 text-lg sm:text-xl font-medium max-w-lg mx-auto leading-relaxed">
          Fast, secure, and hassle-free payment system for all faculty students.
        </p>
        
        <div className="space-y-6 max-w-sm mx-auto">
          <Link 
            to="/pay" 
            className="block w-full py-4 px-8 bg-primary text-white rounded-full font-bold text-lg tracking-wide shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            Pay Your Dues
          </Link>
          <div className="text-sm text-gray-500 mt-6 px-4">
            <p>Ensure you have your Matric Number and a passport photograph ready before starting.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-auto py-8 text-gray-400 text-sm font-medium">
        &copy; {new Date().getFullYear()} Faculty Connect
      </div>
    </div>
  );
};

export default Home;
