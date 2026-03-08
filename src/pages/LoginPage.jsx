import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { authAPI } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call backend API to login user
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      console.log('Login successful:', response);
      
      // Redirect to search (main app)
      navigate('/search');
      
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header showAuth={false} />
      
      <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome Back
            </h2>
            <p className="text-gray-300 text-lg">
              Sign in to your Permit Genie account
            </p>
          </div>
          
          <div className="card p-8">
            <div className="card-content">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
                  {error}
                </div>
              )}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-3">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-modern w-full"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-200 mb-3">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-modern w-full"
                    placeholder="Enter your password"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-accent-500 focus:ring-accent-500 border-gray-600 bg-gray-700 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>
                  
                  <a href="#" className="text-sm text-accent-400 hover:text-accent-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-lg py-4 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
              
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-accent-400 hover:text-accent-300 font-semibold transition-colors"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
