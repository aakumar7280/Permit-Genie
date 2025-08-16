import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { authAPI } from '../services/api';
import { analyzeProjectForPermits } from '../services/paymentService';

const NewProjectForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    workType: '',
    startDate: '',
    projectScope: '',
    budget: '',
    description: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  // Check authentication
  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const userData = authAPI.getCurrentUser();
    if (userData) {
      setUser(userData);
      // Auto-fill contact information from user profile
      setFormData(prev => ({
        ...prev,
        contactName: `${userData.firstName} ${userData.lastName}`,
        contactEmail: userData.email,
      }));
    }
  }, [navigate]);

  const handleChange = (e) => {
    console.log('🔥 NewProjectForm handleChange:', e.target.name, '=', e.target.value);
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    try {
      // Create project with analysis
      const project = {
        id: Date.now(),
        ...formData,
        status: 'Planning',
        createdAt: new Date().toISOString(),
      };

      // Analyze project for permits
      const analysis = analyzeProjectForPermits(project);
      project.analysis = analysis;

      // Save to localStorage
      const existingProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
      const updatedProjects = [...existingProjects, project];
      localStorage.setItem('userProjects', JSON.stringify(updatedProjects));

      // Navigate to projects page
      navigate('/projects');
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '20px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <Sidebar />
      
      <div style={{ flex: 1, padding: '32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
              Create New Project
            </h1>
            <p style={{ color: '#9ca3af' }}>
              Let's set up your construction project and identify the permits you'll need.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{
              backgroundColor: '#374151',
              padding: '32px',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <h2 style={{ color: 'white', fontSize: '24px', marginBottom: '24px' }}>
                Project Information
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    color: 'white', 
                    marginBottom: '8px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}>
                    Project Name *
                  </label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '16px',
                      border: '2px solid #6b7280',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      color: 'black',
                      outline: 'none'
                    }}
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: 'white', 
                    marginBottom: '8px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '16px',
                      border: '2px solid #6b7280',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      color: 'black',
                      outline: 'none'
                    }}
                    placeholder="City, Province/State"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    color: 'white', 
                    marginBottom: '8px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}>
                    Work Type *
                  </label>
                  <select
                    name="workType"
                    value={formData.workType}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '16px',
                      border: '2px solid #6b7280',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      color: 'black',
                      outline: 'none'
                    }}
                  >
                    <option value="">Select work type</option>
                    <option value="renovation">Renovation</option>
                    <option value="new-construction">New Construction</option>
                    <option value="addition">Addition</option>
                    <option value="demolition">Demolition</option>
                    <option value="commercial">Commercial</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: 'white', 
                    marginBottom: '8px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '16px',
                      border: '2px solid #6b7280',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      color: 'black',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  marginBottom: '8px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  Project Scope *
                </label>
                <input
                  type="text"
                  name="projectScope"
                  value={formData.projectScope}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #6b7280',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: 'black',
                    outline: 'none'
                  }}
                  placeholder="e.g., Kitchen renovation, Bathroom addition, etc."
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  marginBottom: '8px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  Budget
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #6b7280',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: 'black',
                    outline: 'none'
                  }}
                >
                  <option value="">Select budget range</option>
                  <option value="under-10k">Under $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="over-100k">Over $100,000</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  color: 'white', 
                  marginBottom: '8px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  Project Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #6b7280',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: 'black',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  placeholder="Describe what work will be done, materials used, areas affected, etc. Be as detailed as possible to get accurate permit recommendations."
                />
              </div>

              {/* Debug Display */}
              <div style={{ 
                backgroundColor: '#1f2937',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '18px' }}>
                  Form Data (Debug):
                </h3>
                <div style={{ color: '#10b981', fontSize: '14px', fontFamily: 'monospace' }}>
                  <div>Project Name: "{formData.projectName}"</div>
                  <div>Location: "{formData.location}"</div>
                  <div>Work Type: "{formData.workType}"</div>
                  <div>Project Scope: "{formData.projectScope}"</div>
                  <div>Description length: {formData.description.length}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  type="submit"
                  disabled={!formData.projectName || !formData.location || !formData.workType || !formData.projectScope || !formData.description}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: !formData.projectName || !formData.location || !formData.workType || !formData.projectScope || !formData.description ? '#6b7280' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: !formData.projectName || !formData.location || !formData.workType || !formData.projectScope || !formData.description ? 'not-allowed' : 'pointer'
                  }}
                >
                  Create Project
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProjectForm;
