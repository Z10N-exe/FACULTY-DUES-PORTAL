import React from 'react';
import { Link } from 'react-router-dom';
import { FaCreditCard, FaBook, FaBullhorn, FaAward, FaUserCheck, FaUserFriends, FaRegLightbulb } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Logo Badge Area */}
          <div className="w-64 h-64 md:w-96 md:h-96 relative flex-shrink-0 animate-fade-in">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative z-10 w-full h-full p-4 rounded-full border-[12px] border-secondary shadow-2xl bg-white flex items-center justify-center transform transition-transform hover:rotate-3 duration-500">
               <img 
                src="/NACOSLOGO.jpeg" 
                alt="NACOS Logo" 
                className="w-full h-full rounded-full object-cover shadow-inner" 
              />
            </div>
          </div>

          {/* Text Area */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              Nigeria Association of <span className="text-primary italic">Computing Students</span>
            </h1>
            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-2xl">
              The premier student body for technology enthusiasts. We are dedicated to pioneering 
              innovation, fostering technical excellence, and bridging the gap between academia 
              and the ever-evolving tech industry.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                to="/pay" 
                className="px-8 py-4 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/30 hover:bg-green-700 hover:-translate-y-1 transition-all duration-300 text-center"
              >
                PAY DUES
              </Link>
              <button className="px-8 py-4 bg-secondary text-primary font-bold rounded-full hover:bg-green-100 transition-all duration-300">
                LEARN MORE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50 border-y border-gray-100 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 text-center group border border-gray-100">
            <div className="w-16 h-16 bg-secondary/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <FaCreditCard className="text-3xl text-primary group-hover:text-white" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">Pay Annual Dues</h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">
              Fast and professional payment system allows you to pay your annual dues in minutes. 
              Get your official receipt instantly.
            </p>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 text-center group border border-gray-100">
            <div className="w-16 h-16 bg-secondary/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <FaBook className="text-3xl text-primary group-hover:text-white" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">Academic Resources</h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">
              Access past questions, study guides, and project materials curated by the 
              NACOS educational committee.
            </p>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 text-center group border border-gray-100">
            <div className="w-16 h-16 bg-secondary/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <FaBullhorn className="text-3xl text-primary group-hover:text-white" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">News & Updates</h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">
              Stay informed about the latest faculty events, tech seminars, and career 
              opportunities within the student body.
            </p>
          </div>
        </div>
      </section>

      {/* Fun Fact Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-primary text-white">
        {/* Background Particles/Shape */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-4 flex items-center justify-center">
            Fun <span className="ml-3 px-4 py-1 bg-white text-primary rounded-xl italic">Facts</span>
          </h2>
          <p className="max-w-3xl mx-auto text-green-50 text-lg opacity-80 mb-16 font-medium">
            The NACOS UNIPORT Chapter is one of the most vibrant and high-achieving student associations in West Africa. 
            Our commitment to excellence speaks for itself.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <FaAward className="text-3xl mr-3 opacity-70" />
                <span className="text-4xl md:text-5xl font-black">15+</span>
              </div>
              <p className="text-xs font-black uppercase tracking-widest opacity-70">Major Awards Won</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <FaUserFriends className="text-3xl mr-3 opacity-70" />
                <span className="text-4xl md:text-5xl font-black">1200+</span>
              </div>
              <p className="text-xs font-black uppercase tracking-widest opacity-70">Active Members</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <FaRegLightbulb className="text-3xl mr-3 opacity-70" />
                <span className="text-4xl md:text-5xl font-black">160+</span>
              </div>
              <p className="text-xs font-black uppercase tracking-widest opacity-70">Innovations Incubated</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <FaUserCheck className="text-3xl mr-3 opacity-70" />
                <span className="text-4xl md:text-5xl font-black">200+</span>
              </div>
              <p className="text-xs font-black uppercase tracking-widest opacity-70">Graduated Success Stories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-3">
            <img src="/UNIPORT-LOGO-PNG.png" alt="Uniport" className="h-10 w-auto invert brightness-0" />
            <div>
              <p className="font-black uppercase text-sm tracking-tighter">UNIPORT <br/> FACULTY CONNECT</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} NACOS UNIPORT. ALL RIGHTS RESERVED.
            </p>
            <p className="text-gray-600 text-[10px] mt-1 italic">
              Empowering the Next Generation of Tech Leaders.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
