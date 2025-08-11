import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const ProjectDetails = () => {
  const { id } = useParams();
  
  // Mock project data
  const project = {
    id: id,
    name: 'Downtown Restaurant Renovation',
    location: '123 Main St, San Francisco, CA',
    workType: 'Construction - Renovation',
    startDate: '2025-09-01',
    status: 'In Progress',
    budget: 150000,
    scope: 'Complete interior renovation of existing restaurant space including kitchen upgrade, dining area redesign, new electrical systems, plumbing updates, and ADA compliance improvements.',
    createdDate: '2025-08-01',
  };

  // Mock permits data
  const permits = [
    {
      id: 1,
      name: 'Building Permit',
      type: 'Construction',
      status: 'Approved',
      applicationDate: '2025-08-05',
      approvalDate: '2025-08-15',
      expiryDate: '2025-12-15',
      fee: 850,
      authority: 'San Francisco Building Department',
    },
    {
      id: 2,
      name: 'Electrical Permit',
      type: 'Electrical',
      status: 'Under Review',
      applicationDate: '2025-08-10',
      approvalDate: null,
      expiryDate: null,
      fee: 420,
      authority: 'San Francisco Building Department',
    },
    {
      id: 3,
      name: 'Plumbing Permit',
      type: 'Plumbing',
      status: 'Pending Application',
      applicationDate: null,
      approvalDate: null,
      expiryDate: null,
      fee: 320,
      authority: 'San Francisco Water Department',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending Application':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-6">
          <Link 
            to="/dashboard" 
            className="text-purple-600 hover:text-purple-500 font-medium mb-4 inline-flex items-center"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-1">{project.location}</p>
        </div>

        {/* Project Info Card */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900">Work Type</h3>
              <p className="text-gray-600">{project.workType}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Start Date</h3>
              <p className="text-gray-600">{project.startDate}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Status</h3>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                {project.status}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Budget</h3>
              <p className="text-gray-600">${project.budget.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Created</h3>
              <p className="text-gray-600">{project.createdDate}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">Project Scope</h3>
            <p className="text-gray-600 leading-relaxed">{project.scope}</p>
          </div>
        </div>

        {/* Permits Section */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Required Permits</h2>
              <div className="flex space-x-3">
                <Link 
                  to={`/checklist/${project.id}`}
                  className="btn-gradient-sunset px-4 py-2 text-sm"
                >
                  View Checklist
                </Link>
                <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Add Permit
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 p-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-white font-medium text-sm">
              <div>Permit Name</div>
              <div>Type</div>
              <div>Status</div>
              <div>Application Date</div>
              <div>Fee</div>
              <div>Authority</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {permits.map((permit) => (
              <div key={permit.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="font-medium text-gray-900">{permit.name}</div>
                  <div className="text-gray-600">{permit.type}</div>
                  <div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(permit.status)}`}>
                      {permit.status}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {permit.applicationDate || 'Not Applied'}
                  </div>
                  <div className="text-gray-600">${permit.fee}</div>
                  <div className="text-gray-600 text-sm">{permit.authority}</div>
                </div>
                
                {permit.status === 'Approved' && permit.approvalDate && (
                  <div className="mt-2 text-sm text-green-700">
                    Approved on {permit.approvalDate} • Expires {permit.expiryDate}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Permit Fees:</span>
              <span className="font-semibold text-gray-900">
                ${permits.reduce((total, permit) => total + permit.fee, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link 
            to={`/checklist/${project.id}`}
            className="btn-gradient-sunset px-6 py-3"
          >
            View Project Checklist
          </Link>
          <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors">
            Edit Project
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
