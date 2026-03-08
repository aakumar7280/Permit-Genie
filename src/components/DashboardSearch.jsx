import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const DashboardSearch = ({ initialQuery = '', onSearch }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [debounceTimer, setDebounceTimer] = useState(null);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Mock suggestions data - replace with API call later
  const mockSuggestions = [
    { 
      id: 1, 
      name: 'Building Renovation Permit', 
      jurisdiction: 'Toronto', 
      tags: ['Construction', 'Residential'] 
    },
    { 
      id: 2, 
      name: 'Food Truck License', 
      jurisdiction: 'Vancouver', 
      tags: ['Food Service', 'Mobile Business'] 
    },
    { 
      id: 3, 
      name: 'Business License - General', 
      jurisdiction: 'Calgary', 
      tags: ['Business', 'Commercial'] 
    },
    { 
      id: 4, 
      name: 'Home Business Permit', 
      jurisdiction: 'Ottawa', 
      tags: ['Home Office', 'Small Business'] 
    },
    { 
      id: 5, 
      name: 'Signage Permit', 
      jurisdiction: 'Montreal', 
      tags: ['Advertising', 'Commercial'] 
    }
  ];

  // Debounced typeahead search
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (query.trim().length > 0) {
      const timer = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);
      setDebounceTimer(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [query]);

  const fetchSuggestions = async (searchQuery) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/permits/suggest?q=${encodeURIComponent(searchQuery)}`);
      // const data = await response.json();
      
      // Mock filtering for now
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suggestion.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suggestion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) {
      if (e.key === 'Enter') {
        handleSubmit();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          selectSuggestion(suggestions[selectedIndex]);
        } else {
          handleSubmit();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    handleSubmit(suggestion.name);
  };

  const handleSubmit = (searchQuery = query) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    // Call onSearch callback if provided
    if (onSearch) {
      onSearch(trimmedQuery);
    }

    // Navigate to results page
    navigate(`/permits?query=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleFocus = () => {
    if (query.trim().length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = (e) => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Main Search Container */}
      <div className="w-full max-w-2xl mx-auto">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Permit Genie
          </h1>
          <p className="text-xl text-gray-300">
            Find the permits you need, fast
          </p>
        </div>

        {/* Search Box */}
        <div className="relative mb-8">
          <div 
            className="relative"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
            aria-owns="suggestions-list"
          >
            <div className="relative flex flex-col sm:flex-row gap-3 sm:gap-0">
              {/* Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border border-white/20 rounded-l-lg sm:rounded-r-none rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  placeholder="Search permits, e.g., building renovation, food truck, business license"
                  aria-label="Search permits"
                  aria-describedby="search-help"
                  autoComplete="off"
                  spellCheck="false"
                />
                {isLoading && (
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={handleSubmit}
                disabled={!query.trim()}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-r-lg sm:rounded-l-none rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px]"
                aria-label="Search permits"
              >
                <span className="hidden sm:inline">Search Permits</span>
                <span className="sm:hidden">Search</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div 
                ref={suggestionsRef}
                id="suggestions-list"
                role="listbox"
                className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id}
                    role="option"
                    aria-selected={selectedIndex === index}
                    className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                      selectedIndex === index 
                        ? 'bg-purple-600/30 text-white' 
                        : 'text-gray-200 hover:bg-white/10'
                    } ${index === 0 ? 'rounded-t-lg' : ''} ${index === suggestions.length - 1 ? 'rounded-b-lg' : 'border-b border-white/10'}`}
                    onClick={() => selectSuggestion(suggestion)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">
                          {suggestion.name}
                        </div>
                        <div className="text-sm text-gray-300 mt-1">
                          {suggestion.jurisdiction}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {suggestion.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-block px-2 py-1 text-xs bg-white/20 text-gray-200 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 ml-3 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Empty State Guidance */}
        <div id="search-help" className="text-center text-gray-400 mb-8">
          <p>Try keywords like <span className="text-gray-300">building renovation</span>, <span className="text-gray-300">signage</span>, <span className="text-gray-300">home business</span></p>
        </div>

        {/* Advanced Tools Link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/projects')}
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200 underline underline-offset-4"
          >
            Advanced tools
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSearch;
