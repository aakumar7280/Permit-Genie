import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import PublicPermitSearch from './pages/PublicPermitSearch';
import SearchPage from './pages/SearchPage';
import MyApplications from './pages/MyApplications';
import ApplicationWizard from './pages/ApplicationWizard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-gray-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/permits" element={<PublicPermitSearch />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Protected Routes - Login Required */}
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
          <Route path="/apply/:permitId" element={<ProtectedRoute><ApplicationWizard /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
