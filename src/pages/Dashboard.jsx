import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { authAPI } from '../services/api';
import { canUserApplyForPermit, getPaymentMessage } from '../services/paymentService';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  
  // Find Permit feature state
  const [showPermitFinder, setShowPermitFinder] = useState(true);
  const [permitQuery, setPermitQuery] = useState('');
  const [permitLocation, setPermitLocation] = useState('toronto');
  const [permits, setPermits] = useState([]);
  const [permitLoading, setPermitLoading] = useState(false);
  const [permitError, setPermitError] = useState('');

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
      
      // Load user's projects
      const userProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
      setProjects(userProjects);
      
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
      
      // Load user's projects
      const userProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
      setProjects(userProjects);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If token is invalid, redirect to login
      authAPI.logout();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // Permit search functionality
  const searchPermits = async (e) => {
    e.preventDefault();
    
    if (!permitQuery || permitQuery.trim().length < 2) {
      setPermitError('Please enter at least 2 characters');
      return;
    }

    setPermitLoading(true);
    setPermitError('');

    try {
      const response = await api.searchPermits(permitQuery, 10);
      
      if (response.success) {
        setPermits(response.permits);
        if (response.permits.length === 0) {
          setPermitError('No permits found for your search. Try different keywords.');
        }
      } else {
        setPermitError(response.error || 'Search failed');
      }
    } catch (err) {
      console.error('Search error:', err);
      setPermitError('Failed to search permits. Please try again.');
    } finally {
      setPermitLoading(false);
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

  // Calculate real stats from projects
  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalPermits = projects.reduce((total, p) => total + (p.selectedPermits?.length || 0), 0);
  const upcomingDeadlines = projects.filter(p => {
    if (!p.startDate) return false;
    const projectDate = new Date(p.startDate);
    const today = new Date();
    const diffTime = projectDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  }).length;

  const stats = [
    { label: 'Active Projects', value: activeProjects.toString(), icon: '📊' },
    { label: 'Total Permits', value: totalPermits.toString(), icon: '📋' },
    { label: 'Completed Projects', value: completedProjects.toString(), icon: '✅' },
    { label: 'Upcoming Deadlines', value: upcomingDeadlines.toString(), icon: '⏰' },
  ];

  // Check user's payment status for permit applications
  const canApply = user ? canUserApplyForPermit(user) : false;
  const paymentMessage = user ? getPaymentMessage(user) : '';

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

        {/* SIMPLIFIED PERMIT SEARCH - NO COMPLEX CSS */}
        <div style={{ backgroundColor: '#374151', padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
          <h2 style={{ color: 'white', fontSize: '24px', marginBottom: '16px' }}>Find Your Permit</h2>
          
          <form onSubmit={searchPermits}>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                value={permitQuery}
                onChange={(e) => setPermitQuery(e.target.value)}
                placeholder="Search for permits (e.g., building renovation, food truck, business license)..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #6b7280',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: 'black'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={permitQuery.trim().length < 2 || permitLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: permitQuery.trim().length < 2 || permitLoading ? 'not-allowed' : 'pointer',
                opacity: permitQuery.trim().length < 2 || permitLoading ? 0.5 : 1
              }}
            >
              {permitLoading ? 'Searching...' : 'Search Permits'}
            </button>
          </form>

          {permitError && (
            <div style={{ 
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#dc2626',
              color: 'white',
              borderRadius: '8px'
            }}>
              {permitError}
            </div>
          )}

          {permits.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h3 style={{ color: 'white', marginBottom: '12px' }}>
                Found {permits.length} permit{permits.length !== 1 ? 's' : ''}
              </h3>
              {permits.map((permit, index) => (
                <div 
                  key={permit.id || index}
                  style={{
                    backgroundColor: '#4b5563',
                    padding: '16px',
                    marginBottom: '12px',
                    borderRadius: '8px'
                  }}
                >
                  <h4 style={{ color: 'white', marginBottom: '8px' }}>{permit.name}</h4>
                  <p style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '8px' }}>{permit.description}</p>
                  <a 
                    href={permit.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#60a5fa', textDecoration: 'underline' }}
                  >
                    View Details
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
            <Link 
              to="/projects/new" 
              className="btn-primary text-sm px-4 py-2"
            >
              + New Project
            </Link>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No projects yet</p>
              <Link to="/projects/new" className="btn-secondary">
                Create Your First Project
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-white">{project.projectName}</h3>
                    <p className="text-sm text-gray-400">{project.location}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      project.status === 'Completed' 
                        ? 'bg-green-900/50 text-green-300' 
                        : 'bg-blue-900/50 text-blue-300'
                    }`}>
                      {project.status || 'Planning'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
