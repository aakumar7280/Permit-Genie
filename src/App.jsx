import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MyProjects from './pages/MyProjects';
import NewProjectForm from './pages/NewProjectForm';
import ProjectDetails from './pages/ProjectDetails';
import Checklist from './pages/Checklist';
import DocumentVault from './pages/DocumentVault';
import Settings from './pages/Settings';
import UpgradePage from './pages/UpgradePage';
import PermitSearch from './components/PermitSearch';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-gray-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Protected Routes - Login Required */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
          <Route path="/permits" element={<ProtectedRoute><PermitSearch /></ProtectedRoute>} />
          <Route path="/new-project" element={<ProtectedRoute><NewProjectForm /></ProtectedRoute>} />
          <Route path="/project/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
          <Route path="/checklist/:id" element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><DocumentVault /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />        </Routes>
      </div>
    </Router>
  );
}

export default App;
