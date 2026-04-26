import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const [hasToken, setHasToken] = useState(!!localStorage.getItem('studentToken'));

  // Re-check token whenever the route changes (covers sign-in/sign-out)
  useEffect(() => {
    setHasToken(!!localStorage.getItem('studentToken'));
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
            to="/pay"
            className="bg-green-600 text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            Contribute
          </Link>
          {hasToken ? (
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Dashboard
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
