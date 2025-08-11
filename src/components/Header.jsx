import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ showAuth = true }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
      ${isScrolled 
        ? 'bg-gray-900/80 backdrop-blur-xl border-b border-accent-500/20 shadow-glow' 
        : 'bg-transparent border-b border-transparent'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-electric-600 flex items-center justify-center mr-4 shadow-glow group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-110">
                {/* Subtle animated border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-400/50 to-electric-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow"></div>
                <span className="relative text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold gradient-text group-hover:gradient-text-accent transition-all duration-300">
                Permit Genie
              </span>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="relative text-gray-300 hover:text-white transition-all duration-300 py-2 px-1 group"
            >
              <span className="relative z-10">Home</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-400 to-electric-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link 
              to="/about" 
              className="relative text-gray-300 hover:text-white transition-all duration-300 py-2 px-1 group"
            >
              <span className="relative z-10">About</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-400 to-electric-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link 
              to="/contact" 
              className="relative text-gray-300 hover:text-white transition-all duration-300 py-2 px-1 group"
            >
              <span className="relative z-10">Contact</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-400 to-electric-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </nav>
          
          {/* Auth Buttons */}
          {showAuth && (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="relative text-gray-300 hover:text-white transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/5"
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
