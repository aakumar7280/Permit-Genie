// API service for communicating with backend
const API_BASE_URL = 'http://localhost:3001/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Get user data from localStorage
const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Set user data in localStorage
const setUserData = (user) => {
  localStorage.setItem('userData', JSON.stringify(user));
};

// Remove user data from localStorage
const removeUserData = () => {
  localStorage.removeItem('userData');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.status === 'success') {
      setAuthToken(response.data.token);
      setUserData(response.data.user);
    }
    
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.status === 'success') {
      setAuthToken(response.data.token);
      setUserData(response.data.user);
    }
    
    return response;
  },

  // Get user profile
  getProfile: async () => {
    return await apiRequest('/auth/profile');
  },

  // Logout user
  logout: () => {
    removeAuthToken();
    removeUserData();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Get current user data
  getCurrentUser: () => {
    return getUserData();
  }
};

// Permit Search API
export const permitsAPI = {
  // Search permits
  searchPermits: async (query, limit = 5) => {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString()
    });
    
    return apiRequest(`/permits/search?${params}`);
  },

  // Get permit by ID
  getPermitById: async (id) => {
    return apiRequest(`/permits/${id}`);
  },

  // Get permits by category
  getPermitsByCategory: async (category, limit = 10) => {
    return apiRequest(`/permits/category/${category}?limit=${limit}`);
  },

  // Get all permit categories
  getPermitCategories: async () => {
    return apiRequest('/permits/meta/categories');
  }
};

// Default export for permits API
export default permitsAPI;

// Export utility functions
export { getAuthToken, setAuthToken, removeAuthToken, getUserData, setUserData, removeUserData };
