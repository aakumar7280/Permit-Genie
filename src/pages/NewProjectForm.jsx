import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const NewProjectForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    projectName: '',
    location: '',
    workType: '',
    startDate: '',
    // Step 2
    projectScope: '',
    budget: '',
  });

  const workTypes = [
    'Construction - New Building',
    'Construction - Renovation',
    'Construction - Demolition',
    'Event - Outdoor Festival',
    'Event - Corporate Gathering',
    'Event - Wedding/Private Party',
    'Electrical Work',
    'Plumbing Work',
    'HVAC Installation',
    'Other',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd make an API call here
    console.log('Project data:', formData);
    
    // Redirect to project details for demo purposes
    navigate('/project/new');
  };

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Project
            </h1>
            <p className="text-gray-600">
              Let's gather some information about your project to find the right permits.
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm font-medium text-gray-500 mb-2">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="card p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Basic Project Information
                  </h2>
                  
                  <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name *
                    </label>
                    <input
                      id="projectName"
                      name="projectName"
                      type="text"
                      required
                      value={formData.projectName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="e.g., Downtown Restaurant Renovation"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Location *
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="e.g., 123 Main St, San Francisco, CA"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="workType" className="block text-sm font-medium text-gray-700 mb-2">
                      Type of Work *
                    </label>
                    <select
                      id="workType"
                      name="workType"
                      required
                      value={formData.workType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    >
                      <option value="">Select work type</option>
                      {workTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Planned Start Date *
                    </label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
              )}
              
              {/* Step 2: Project Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Project Details
                  </h2>
                  
                  <div>
                    <label htmlFor="projectScope" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Scope Description *
                    </label>
                    <textarea
                      id="projectScope"
                      name="projectScope"
                      rows={6}
                      required
                      value={formData.projectScope}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Provide detailed description of the work to be performed..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Budget
                    </label>
                    <input
                      id="budget"
                      name="budget"
                      type="number"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Enter budget amount"
                    />
                  </div>
                </div>
              )}
              
              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Review & Submit
                  </h2>
                  
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">Project Name</h3>
                        <p className="text-gray-600">{formData.projectName}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Location</h3>
                        <p className="text-gray-600">{formData.location}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Work Type</h3>
                        <p className="text-gray-600">{formData.workType}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Start Date</h3>
                        <p className="text-gray-600">{formData.startDate}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">Project Scope</h3>
                      <p className="text-gray-600">{formData.projectScope}</p>
                    </div>
                    
                    {formData.budget && (
                      <div>
                        <h3 className="font-medium text-gray-900">Budget</h3>
                        <p className="text-gray-600">${Number(formData.budget).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-6 py-3 border border-gray-300 rounded-lg font-medium transition-colors ${
                    currentStep === 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  disabled={currentStep === 1}
                >
                  Previous
                </button>
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-gradient-emerald px-8 py-3"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-gradient-emerald px-8 py-3"
                  >
                    Create Project
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProjectForm;
