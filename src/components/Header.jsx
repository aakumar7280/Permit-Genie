import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Header = ({ showAuth = true, light = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isLoggedIn = authAPI.isAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
    window.location.reload();
  };

  const headerBg = light
    ? isScrolled
      ? 'rgba(255,255,255,0.95)'
      : 'rgba(255,255,255,0)'
    : undefined;

  const headerClass = light
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled ? 'backdrop-blur-xl shadow-sm' : 'border-b border-transparent'
      }`
    : `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled ? 'backdrop-blur-xl shadow-glow' : 'bg-transparent border-b border-transparent'
      }`;

  // Build nav links based on login state
  const navLinks = isLoggedIn
    ? [['/', 'Home'], ['/search', 'Find Permits'], ['/applications', 'My Applications'], ['/about', 'About'], ['/contact', 'Contact']]
    : [['/', 'Home'], ['/permits', 'Find Permits'], ['/about', 'About'], ['/contact', 'Contact']];

  return (
    <header className={headerClass} style={light ? { backgroundColor: headerBg } : { backgroundColor: isScrolled ? 'rgba(25,25,25,0.85)' : undefined }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-electric-600 flex items-center justify-center mr-4 shadow-glow group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-110">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-400/50 to-electric-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow"></div>
                <span className="relative text-white font-bold text-xl">P</span>
              </div>
              <span className={`text-2xl font-bold transition-all duration-300 ${light ? '' : 'gradient-text group-hover:gradient-text-accent'}`} style={light ? { color: '#191919', fontWeight: 800 } : {}}>
                Permit Genie
              </span>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map(([path, label]) => (
              <Link
                key={path}
                to={path}
                className="relative transition-all duration-300 py-2 px-1 group"
                style={{ color: light ? '#6b7280' : undefined, fontWeight: light ? 500 : undefined }}
                onMouseEnter={e => { if (light) e.currentTarget.style.color = '#191919'; }}
                onMouseLeave={e => { if (light) e.currentTarget.style.color = '#6b7280'; }}
              >
                <span className={`relative z-10 ${!light ? 'text-gray-300 hover:text-white' : ''}`}>{label}</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-400 to-electric-500 group-hover:w-full transition-all duration-300"></div>
              </Link>
            ))}
          </nav>
          
          {/* Auth Buttons */}
          {showAuth && (
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className={`relative transition-all duration-300 py-2 px-5 rounded-lg font-medium ${
                    light
                      ? 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                      : 'text-gray-300 hover:text-red-400 hover:bg-red-500/10'
                  }`}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className={`relative transition-all duration-300 py-2 px-4 rounded-lg ${
                      light
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="btn-primary relative overflow-hidden group"
                  >
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </>
              )}
            </div>
          )}
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
