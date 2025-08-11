import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { authAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get user data from localStorage
    const userData = authAPI.getCurrentUser();
    if (userData) {
      setUser(userData);
      setLoading(false);
    } else {
      // If no user data in localStorage, fetch from backend
      fetchUserProfile();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If token is invalid, redirect to login
      authAPI.logout();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while fetching user data
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Mock data for recent projects
  const recentProjects = [
    {
      id: 1,
      name: 'Downtown Restaurant Renovation',
      location: 'San Francisco, CA',
      status: 'In Progress',
      permits: 3,
      deadline: '2025-09-15',
    },
    {
      id: 2,
      name: 'Corporate Event - Tech Conference',
      location: 'Austin, TX',
      status: 'Pending Review',
      permits: 2,
      deadline: '2025-08-30',
    },
    {
      id: 3,
      name: 'Office Building Construction',
      location: 'Seattle, WA',
      status: 'Completed',
      permits: 5,
      deadline: '2025-07-20',
    },
  ];

  const stats = [
    { label: 'Active Projects', value: '8', icon: '📊' },
    { label: 'Pending Permits', value: '12', icon: '📋' },
    { label: 'Completed This Month', value: '5', icon: '✅' },
    { label: 'Upcoming Deadlines', value: '3', icon: '⏰' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text-blue mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-300">
            Here's what's happening with your projects today.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="text-2xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link 
              to="/new-project" 
              className="card p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 icon-gradient-1 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">➕</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-purple-400">
                    Start New Project
                  </h3>
                  <p className="text-sm text-gray-400">Begin permit application process</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/documents" 
              className="card p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 icon-gradient-2 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📄</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-teal-400">
                    Document Vault
                  </h3>
                  <p className="text-sm text-gray-400">Access your documents</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/settings" 
              className="card p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 icon-gradient-3 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">⚙️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-pink-400">
                    Settings
                  </h3>
                  <p className="text-sm text-gray-400">Manage your account</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
            <Link 
              to="/projects" 
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              View All
            </Link>
          </div>
          
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-white font-medium">
                <div>Project Name</div>
                <div>Location</div>
                <div>Status</div>
                <div>Permits</div>
                <div>Deadline</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-700">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/project/${project.id}`}
                  className="block p-4 hover:bg-slate-800 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="font-medium text-white">{project.name}</div>
                    <div className="text-gray-300">{project.location}</div>
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'Completed' 
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="text-gray-300">{project.permits} permits</div>
                    <div className="text-gray-300">{project.deadline}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
