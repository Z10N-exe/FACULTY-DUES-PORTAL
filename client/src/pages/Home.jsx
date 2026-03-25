import React from 'react';
import { Link } from 'react-router-dom';
import { FaCreditCard, FaBook, FaBullhorn, FaAward, FaUserCheck, FaUserFriends, FaRegLightbulb } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Logo Area */}
          <div className="w-48 h-48 md:w-72 md:h-72 flex-shrink-0 animate-fade-in">
            <div className="w-full h-full p-2 rounded-full border-4 border-gray-200 bg-white shadow-sm flex items-center justify-center">
               <img 
                src="/NACOSLOGO.jpeg" 
                alt="NACOS Logo" 
                className="w-full h-full rounded-full object-cover" 
              />
            </div>
          </div>

          {/* Text Area */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Nigeria Association of <br/> <span className="text-primary">Computing Students</span>
            </h1>
            <p className="text-lg text-gray-600 font-normal leading-relaxed max-w-2xl">
              Official portal for technical innovation and student excellence at the University of Port Harcourt. 
              Bridging academia and the global tech industry.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                to="/pay" 
                className="px-8 py-3 bg-primary text-white font-bold rounded-md shadow-md hover:bg-green-700 transition-colors text-center uppercase tracking-widest text-xs"
              >
                Get Started
              </Link>
              <button className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-md hover:bg-gray-50 transition-colors">
                LEARN MORE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center">
            <div className="w-14 h-14 bg-green-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCreditCard className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-tight">Dues Portal</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Fast and secure payment system. Generate your official receipt instantly after transaction.
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-green-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBook className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-tight">Academic Resources</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Access curated study guides, past questions, and technical documentation.
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-green-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBullhorn className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-tight">News & Updates</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Stay informed about latest faculty events and internship opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-4xl font-extrabold mb-1 tracking-tighter">15+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Major Awards</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-1 tracking-tighter">1200+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Active Members</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-1 tracking-tighter">160+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Innovations</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-1 tracking-tighter">200+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Alumni</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-200 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3 grayscale opacity-60">
            <img src="/UNIPORT-LOGO-PNG.png" alt="Uniport" className="h-8 w-auto" />
            <p className="font-bold text-xs uppercase tracking-tight">FACULTY CONNECT</p>
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} NACOS UNIPORT.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
