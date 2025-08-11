import React from 'react';

const Footer = () => {
  return (
    <footer className="relative bg-gray-900/60 backdrop-blur-xl border-t border-accent-500/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-electric-600 flex items-center justify-center mr-4 shadow-glow">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <span className="text-2xl font-bold gradient-text">Permit Genie</span>
            </div>
            <p className="text-gray-300 max-w-md leading-relaxed mb-6">
              Next-generation permit management powered by AI. Transforming how professionals 
              handle compliance and accelerate project delivery.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Stay Updated</h4>
              <div className="flex gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="input-modern flex-1 text-sm"
                />
                <button className="btn-primary text-sm px-6 py-3">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Platform</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#features" className="hover:text-accent-300 transition-all duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-accent-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  AI Permit Discovery
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-accent-300 transition-all duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-accent-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Smart Analytics
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-accent-300 transition-all duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-accent-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Expert Support
                </a>
              </li>
              <li>
                <a href="#api" className="hover:text-accent-300 transition-all duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-accent-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Developer API
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Company</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#about" className="hover:text-accent-300 transition-all duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-electric-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-accent-300 transition-all duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-electric-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-accent-300 transition-all duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-electric-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Careers
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-accent-300 transition-all duration-300 flex items-center group">
                  <span className="w-1 h-1 bg-electric-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-accent-500/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm">
              © 2025 Permit Genie. All rights reserved. • Built with ❤️ for the future of compliance.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-accent-300 transition-all duration-300 hover:scale-110">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-300 transition-all duration-300 hover:scale-110">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-300 transition-all duration-300 hover:scale-110">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
