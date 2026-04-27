import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const API = 'https://faculty-dues-api-72mv.onrender.com/api';

const Header = () => {
  const location = useLocation();
  const [hasToken, setHasToken] = useState(!!localStorage.getItem('studentToken'));
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setHasToken(!!localStorage.getItem('studentToken'));
  }, [location.pathname]);

  // Check for unseen announcements
  useEffect(() => {
    if (!localStorage.getItem('studentToken')) return;
    axios.get(`${API}/announcements`).then(res => {
      const seen = JSON.parse(localStorage.getItem('seenAnnouncements') || '[]');
      const unseen = res.data.filter(a => !seen.includes(a._id));
      setUnreadCount(unseen.length);
    }).catch(() => {});
  }, [location.pathname]);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/UNIPORT-LOGO-PNG.png" alt="UNIPORT" className="h-9 w-auto" />
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-gray-900 leading-none uppercase tracking-tight">University of Port Harcourt</p>
            <p className="text-[9px] text-green-600 font-bold uppercase tracking-widest mt-0.5">Faculty of Computing</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-5">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Home
          </Link>
          <Link
            to="/blog"
            className={`text-sm font-medium transition-colors ${location.pathname === '/blog' ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Blog
          </Link>
          {hasToken ? (
            <Link
              to="/dashboard"
              className={`relative text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Dashboard
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-3 inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          ) : (
            <Link
              to="/login"
              className={`text-sm font-medium transition-colors ${location.pathname === '/login' ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Sign in
            </Link>
          )}
        </nav>

      </div>
    </header>
  );
};

export default Header;
