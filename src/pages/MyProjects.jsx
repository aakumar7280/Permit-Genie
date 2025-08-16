import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { authAPI } from '../services/api';

const MyProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get user data
    const userData = authAPI.getCurrentUser();
    setUser(userData);

    // Load projects from localStorage for now (until backend is implemented)
    loadProjects();
  }, [navigate]);

  const loadProjects = async () => {
    try {
      // For now, get projects from localStorage
      const savedProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
      setProjects(savedProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Planning':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('userProjects', JSON.stringify(updatedProjects));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Loading your projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            My Projects
          </h1>
          <p className="text-gray-400">
            Manage all your construction and event projects in one place.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Projects</p>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Active Projects</p>
                <p className="text-2xl font-bold text-white">
                  {projects.filter(p => p.status === 'In Progress').length}
                </p>
              </div>
              <div className="text-2xl">🚧</div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {projects.filter(p => p.status === 'Completed').length}
                </p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Permits</p>
                <p className="text-2xl font-bold text-white">
                  {projects.reduce((total, p) => total + (p.selectedPermits?.length || 0), 0)}
                </p>
              </div>
              <div className="text-2xl">📋</div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-3xl text-white">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">No Projects Yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create your first project to get started with permit discovery and management.
            </p>
            <Link
              to="/new-project"
              className="btn-primary inline-flex items-center"
            >
              <span className="mr-2">➕</span>
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">All Projects</h2>
              <Link 
                to="/new-project"
                className="btn-primary flex items-center"
              >
                <span className="mr-2">➕</span>
                New Project
              </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="card-content">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {project.projectName}
                        </h3>
                        <p className="text-gray-400 text-sm">{project.location}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/project/${project.id}`}
                          className="text-purple-400 hover:text-purple-300 text-sm"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Work Type:</span>
                        <span className="text-gray-300">{project.workType}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Budget:</span>
                        <span className="text-gray-300">{project.budget || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Start Date:</span>
                        <span className="text-gray-300">{project.startDate || 'Not set'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status || 'Planning')}`}>
                        {project.status || 'Planning'}
                      </span>
                      <span className="text-sm text-gray-400">
                        {project.selectedPermits?.length || 0} permits
                      </span>
                    </div>
                    
                    {project.selectedPermits && project.selectedPermits.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-600">
                        <p className="text-xs text-gray-400 mb-2">Selected Permits:</p>
                        <div className="flex flex-wrap gap-1">
                          {project.selectedPermits.slice(0, 3).map((permit) => (
                            <span key={permit.id} className="inline-flex px-2 py-1 text-xs bg-slate-700 text-gray-300 rounded">
                              {permit.name}
                            </span>
                          ))}
                          {project.selectedPermits.length > 3 && (
                            <span className="inline-flex px-2 py-1 text-xs bg-slate-700 text-gray-300 rounded">
                              +{project.selectedPermits.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
