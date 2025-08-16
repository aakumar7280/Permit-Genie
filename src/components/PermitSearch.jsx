import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import api from '../services/api';

const PermitSearch = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('toronto'); // Default to Toronto
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Available locations/databases
  const locations = [
    { id: 'toronto', name: 'Toronto, ON', description: '134 permits and licenses' },
    { id: 'vancouver', name: 'Vancouver, BC', description: 'Coming soon' },
    { id: 'montreal', name: 'Montreal, QC', description: 'Coming soon' },
    { id: 'calgary', name: 'Calgary, AB', description: 'Coming soon' }
  ];

  const searchPermits = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setError('Please enter at least 2 characters');
      return;
    }

    if (location !== 'toronto') {
      setError('Only Toronto permits are currently available. More locations coming soon!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.searchPermits(searchQuery, 10);
      
      if (response.success) {
        setPermits(response.permits);
        if (response.permits.length === 0) {
          setError('No permits found for your search. Try different keywords.');
        }
      } else {
        setError(response.error || 'Search failed');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search permits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchPermits(query);
  };

  const handleCategoryClick = (category) => {
    setQuery(category.toLowerCase());
    searchPermits(category.toLowerCase());
  };

  const handleExampleClick = (example) => {
    setQuery(example);
    searchPermits(example);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="max-w-4xl mx-auto p-6 pt-24">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Find Your Permit</h1>
          <p className="text-lg text-gray-300">
            Search through permits and licenses with smart keyword matching
          </p>
        </div>

        {/* Location Selector */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-8 shadow-modern">
          <h2 className="text-xl font-semibold text-white mb-4">Select Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setLocation(loc.id)}
                className={`p-4 rounded-lg border transition-all duration-300 text-left ${
                  location === loc.id
                    ? 'bg-accent-500/20 border-accent-500 shadow-glow'
                    : 'bg-gray-700/50 border-gray-600/50 hover:border-gray-500/50 hover:bg-gray-600/50'
                }`}
              >
                <div className="font-medium text-white">{loc.name}</div>
                <div className={`text-sm mt-1 ${
                  location === loc.id ? 'text-accent-300' : 'text-gray-400'
                }`}>
                  {loc.description}
                </div>
                {loc.id !== 'toronto' && (
                  <span className="inline-block mt-2 px-2 py-1 bg-yellow-900/50 text-yellow-300 text-xs rounded border border-yellow-700/50">
                    Coming Soon
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search for permits in ${locations.find(l => l.id === location)?.name}... (e.g., 'building renovation', 'food truck', 'business license')`}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-lg text-white placeholder-gray-400 transition-all"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || query.trim().length < 2}
              className="px-8 py-3 bg-gradient-to-r from-accent-600 to-electric-600 text-white rounded-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-300"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {location !== 'toronto' && (
            <p className="text-yellow-300 text-sm mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Only Toronto permits are currently available. More locations coming soon!
            </p>
          )}
        </form>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              'Business',
              'Building', 
              'Vehicle',
              'Trade',
              'Parking',
              'Licence'
            ].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-accent-500/50 hover:bg-gray-700/50 transition-all duration-300 text-center disabled:opacity-50"
                disabled={loading || location !== 'toronto'}
              >
                <div className="text-white font-medium">{category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700/50 text-red-300 p-4 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-400"></div>
            <p className="mt-2 text-gray-300">Searching permits...</p>
          </div>
        )}

        {/* Results */}
        {permits.length > 0 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-white">
              Found {permits.length} permit{permits.length > 1 ? 's' : ''} in {locations.find(l => l.id === location)?.name}
            </h2>
            {permits.map((permit) => (
              <div key={permit.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:shadow-glow transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {permit.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm border border-accent-500/30">
                      {permit.category}
                    </span>
                  </div>
                  <div className="text-right">
                    {permit.relevanceScore && (
                      <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-sm border border-green-700">
                        {permit.relevanceScore}% match
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {permit.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Permit #{permit.csvId}
                  </span>
                  {permit.url && (
                    <a
                      href={permit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent-600 to-electric-600 text-white rounded-lg hover:shadow-glow transition-all duration-300"
                    >
                      Apply Now
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Example Searches */}
        {permits.length === 0 && !loading && !error && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-modern">
            <h3 className="text-lg font-semibold text-white mb-4">Try searching for:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                'building renovation',
                'food truck',
                'business license',
                'taxi driver',
                'parking permit',
                'sign permit',
                'restaurant license',
                'construction permit'
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => handleExampleClick(example)}
                  disabled={location !== 'toronto'}
                  className="text-left p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg hover:border-accent-500/50 hover:bg-gray-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-accent-400 font-medium">"{example}"</span>
                </button>
              ))}
            </div>
            {location !== 'toronto' && (
              <p className="text-gray-400 text-sm mt-4">
                Switch to Toronto to try these example searches
              </p>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default PermitSearch;
