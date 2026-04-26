import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCreditCard, FaBook, FaBullhorn } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    axios.get(`${API}/announcements`)
      .then(res => setAnnouncements(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* About Section */}
      <section className="py-16 md:py-24 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Logo in circular frame */}
          <div className="flex-shrink-0">
            <div className="w-52 h-52 rounded-full border border-gray-200 shadow-md overflow-hidden bg-white flex items-center justify-center">
              <img src="/NACOSLOGO.jpeg" alt="NACOS Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 space-y-5 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              About <span className="text-green-600 italic">Us</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
              NACOS UNIPORT is the official association of computing students at the University of Port Harcourt.
              We connect students with opportunities, resources, and a community that grows together.
            </p>
            <Link
              to="/register"
              className="inline-block bg-green-600 text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              Join the community
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            What we <span className="text-green-600 italic">offer</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div>
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCreditCard className="text-xl" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Member Contributions</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Secure online contributions with instant receipt generation.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBook className="text-xl" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Academic Resources</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Study guides, past questions, and technical documentation.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBullhorn className="text-xl" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">News & Updates</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Stay informed about faculty events and opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Latest <span className="text-green-600 italic">announcements</span>
          </h2>
          {announcements.length === 0 ? (
            <p className="text-gray-400 text-sm">Nothing new right now — check back soon.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {announcements.map(a => (
                <li key={a._id} className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{a.body}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap pt-0.5">
                      {new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-green-600 text-white px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          <div>
            <p className="text-4xl font-bold tracking-tight">15+</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Major Awards</p>
          </div>
          <div>
            <p className="text-4xl font-bold tracking-tight">1200+</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Active Members</p>
          </div>
          <div>
            <p className="text-4xl font-bold tracking-tight">160+</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Innovations</p>
          </div>
          <div>
            <p className="text-4xl font-bold tracking-tight">200+</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Alumni</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 opacity-50">
            <img src="/UNIPORT-LOGO-PNG.png" alt="Uniport" className="h-7 w-auto" />
            <img src="/NACOSLOGO.jpeg" alt="NACOS" className="h-7 w-7 rounded-full object-cover" />
          </div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} NACOS UNIPORT. Faculty of Computing.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
