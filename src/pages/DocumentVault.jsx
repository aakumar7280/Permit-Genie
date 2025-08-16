import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const DocumentVault = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock documents data
  const documents = [
    {
      id: 1,
      name: 'Building Permit Application.pdf',
      category: 'permits',
      project: 'Downtown Restaurant Renovation',
      uploadDate: '2025-08-05',
      size: '2.4 MB',
      type: 'pdf',
      status: 'approved',
    },
    {
      id: 2,
      name: 'Architectural Plans.dwg',
      category: 'plans',
      project: 'Downtown Restaurant Renovation',
      uploadDate: '2025-08-03',
      size: '15.8 MB',
      type: 'dwg',
      status: 'current',
    },
    {
      id: 3,
      name: 'Electrical Permit.pdf',
      category: 'permits',
      project: 'Downtown Restaurant Renovation',
      uploadDate: '2025-08-10',
      size: '1.8 MB',
      type: 'pdf',
      status: 'pending',
    },
    {
      id: 4,
      name: 'Contractor License.pdf',
      category: 'licenses',
      project: 'General',
      uploadDate: '2025-07-15',
      size: '0.9 MB',
      type: 'pdf',
      status: 'current',
    },
    {
      id: 5,
      name: 'Insurance Certificate.pdf',
      category: 'insurance',
      project: 'General',
      uploadDate: '2025-07-20',
      size: '1.2 MB',
      type: 'pdf',
      status: 'current',
    },
    {
      id: 6,
      name: 'Site Survey.pdf',
      category: 'plans',
      project: 'Office Building Construction',
      uploadDate: '2025-08-01',
      size: '3.1 MB',
      type: 'pdf',
      status: 'current',
    },
    {
      id: 7,
      name: 'Environmental Report.docx',
      category: 'reports',
      project: 'Office Building Construction',
      uploadDate: '2025-07-28',
      size: '4.7 MB',
      type: 'docx',
      status: 'current',
    },
    {
      id: 8,
      name: 'Event Permit Application.pdf',
      category: 'permits',
      project: 'Corporate Event - Tech Conference',
      uploadDate: '2025-08-02',
      size: '1.1 MB',
      type: 'pdf',
      status: 'submitted',
    },
  ];

    const categories = [
    { id: 'permits', name: 'Permits', icon: '📋', gradient: 'from-slate-500 to-slate-600' },
    { id: 'plans', name: 'Plans & Drawings', icon: '📐', gradient: 'from-slate-500 to-slate-600' },
    { id: 'licenses', name: 'Licenses', icon: '🆔', gradient: 'from-slate-500 to-slate-600' },
    { id: 'insurance', name: 'Insurance', icon: '🛡️', gradient: 'from-slate-500 to-slate-600' },
    { id: 'reports', name: 'Reports', icon: '📊', gradient: 'from-slate-500 to-slate-600' },
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'dwg': return '📐';
      case 'docx': return '📝';
      case 'jpg':
      case 'png': return '🖼️';
      default: return '📁';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-900/50 text-green-300 border border-green-700/50';
      case 'current': return 'bg-blue-900/50 text-blue-300 border border-blue-700/50';
      case 'pending': return 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50';
      case 'submitted': return 'bg-purple-900/50 text-purple-300 border border-purple-700/50';
      default: return 'bg-gray-700/50 text-gray-300 border border-gray-600/50';
    }
  };

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Document Vault</h1>
          <p className="text-gray-400">
            Securely store and organize all your project documents
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-6 shadow-modern">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-accent-500/20 text-accent-400' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-accent-500/20 text-accent-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <button className="bg-gradient-to-r from-accent-600 to-electric-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-glow transition-all duration-300">
                Upload Document
              </button>
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r from-accent-600 to-electric-600 text-white shadow-glow`
                  : 'bg-gray-800/50 text-gray-300 border border-gray-600/50 hover:border-gray-500/50 hover:bg-gray-700/50'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Document Display */}
        {viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:shadow-glow transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl">{getFileIcon(doc.type)}</div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 rounded text-gray-400 hover:text-accent-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="p-1 rounded text-gray-400 hover:text-green-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <button className="p-1 rounded text-gray-400 hover:text-red-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <h3 className="font-medium text-white mb-2 truncate" title={doc.name}>
                  {doc.name}
                </h3>
                
                <p className="text-sm text-gray-400 mb-2">{doc.project}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>{doc.uploadDate}</span>
                  <span>{doc.size}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 p-4">
              <div className="grid grid-cols-6 gap-4 text-white font-medium text-sm">
                <div className="col-span-2">Document</div>
                <div>Project</div>
                <div>Upload Date</div>
                <div>Size</div>
                <div>Status</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors group">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div className="col-span-2 flex items-center space-x-3">
                      <div className="text-2xl">{getFileIcon(doc.type)}</div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.type.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-gray-600">{doc.project}</div>
                    <div className="text-gray-600">{doc.uploadDate}</div>
                    <div className="text-gray-600">{doc.size}</div>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 rounded text-gray-400 hover:text-blue-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-1 rounded text-gray-400 hover:text-green-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                        <button className="p-1 rounded text-gray-400 hover:text-red-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Upload your first document to get started.'
              }
            </p>
            <button className="btn-gradient-blue px-6 py-3">
              Upload Document
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentVault;
