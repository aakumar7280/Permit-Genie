import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load project data from localStorage
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const foundProject = projects.find(p => p.id === id);
    
    if (foundProject) {
      setProject(foundProject);
    } else {
      // Project not found, redirect to projects page
      navigate('/projects');
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-900">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-accent-400">Loading project...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen bg-slate-900">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Project Not Found</h2>
            <Link to="/projects" className="text-accent-400 hover:text-accent-300">
              ← Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Use project's selected permits or empty array
  const permits = project.selectedPermits || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-900/50 text-green-300 border border-green-700/50';
      case 'Under Review':
        return 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50';
      case 'Pending Application':
        return 'bg-red-900/50 text-red-300 border border-red-700/50';
      case 'In Progress':
        return 'bg-blue-900/50 text-blue-300 border border-blue-700/50';
      case 'Active':
        return 'bg-green-900/50 text-green-300 border border-green-700/50';
      default:
        return 'bg-gray-700/50 text-gray-300 border border-gray-600/50';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-6">
          <Link 
            to="/projects" 
            className="text-accent-400 hover:text-accent-300 font-medium mb-4 inline-flex items-center transition-colors"
          >
            ← Back to My Projects
          </Link>
          <h1 className="text-3xl font-bold text-white">{project.name}</h1>
          <p className="text-gray-400 mt-1">{project.location}</p>
        </div>

        {/* Project Info Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-8 shadow-modern">
          <h2 className="text-xl font-semibold text-white mb-4">Project Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-200">Work Type</h3>
              <p className="text-gray-400">{project.workType}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-200">Start Date</h3>
              <p className="text-gray-400">{project.startDate}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-200">Status</h3>
              <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-200">Budget</h3>
              <p className="text-gray-400">${project.budget ? project.budget.toLocaleString() : 'Not specified'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-200">Created</h3>
              <p className="text-gray-400">{new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          {project.description && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-200 mb-2">Project Description</h3>
              <p className="text-gray-400 leading-relaxed">{project.description}</p>
            </div>
          )}
        </div>

        {/* Permits Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-modern">
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Selected Permits</h2>
              <div className="flex space-x-3">
                <Link 
                  to={`/checklist/${project.id}`}
                  className="bg-gradient-to-r from-accent-600 to-electric-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-glow transition-all duration-300"
                >
                  View Checklist
                </Link>
                <Link 
                  to="/permits"
                  className="bg-gray-700/50 border border-gray-600/50 text-gray-200 hover:bg-gray-600/50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Browse Permits
                </Link>
              </div>
            </div>
          </div>
          
          {permits.length > 0 ? (
            <>
              <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-300 font-medium text-sm">
                  <div>Permit Name</div>
                  <div>Category</div>
                  <div>Description</div>
                  <div>URL</div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-700/50">
                {permits.map((permit, index) => (
                  <div key={permit.id || index} className="p-4 hover:bg-gray-700/30 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                      <div className="font-medium text-white">{permit.name}</div>
                      <div className="text-accent-400">{permit.category}</div>
                      <div className="text-gray-400 text-sm">{permit.description}</div>
                      <div>
                        <a 
                          href={permit.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent-400 hover:text-accent-300 text-sm underline transition-colors"
                        >
                          View Details →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">No permits selected for this project</div>
              <Link 
                to="/permits"
                className="text-accent-400 hover:text-accent-300 underline transition-colors"
              >
                Browse Available Permits →
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link 
            to={`/checklist/${project.id}`}
            className="bg-gradient-to-r from-accent-600 to-electric-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-glow transition-all duration-300"
          >
            View Project Checklist
          </Link>
          <Link 
            to="/documents"
            className="bg-gray-700/50 border border-gray-600/50 text-gray-200 hover:bg-gray-600/50 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Document Vault
          </Link>
        </div>
      </div>
    </div>
  );

};

export default ProjectDetails;
