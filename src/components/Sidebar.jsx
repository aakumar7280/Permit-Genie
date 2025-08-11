import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear authentication tokens and user data
    authAPI.logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠', gradient: 'from-slate-600 via-slate-700 to-slate-800' },
    { path: '/new-project', label: 'New Project', icon: '➕', gradient: 'from-slate-600 via-slate-700 to-slate-800' },
    { path: '/projects', label: 'My Projects', icon: '📁', gradient: 'from-slate-600 via-slate-700 to-slate-800' },
    { path: '/documents', label: 'Document Vault', icon: '📄', gradient: 'from-slate-600 via-slate-700 to-slate-800' },
    { path: '/settings', label: 'Settings', icon: '⚙️', gradient: 'from-slate-600 via-slate-700 to-slate-800' },
  ];

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700 flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold text-white">Permit Genie</span>
        </div>
      </div>
      
      <nav className="mt-6 px-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-300 rounded-lg hover:bg-red-600/20 hover:text-red-400 transition-all duration-200"
        >
          <span className="mr-3 text-lg">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
