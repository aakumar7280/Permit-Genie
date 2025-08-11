import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import NewProjectForm from './pages/NewProjectForm';
import ProjectDetails from './pages/ProjectDetails';
import Checklist from './pages/Checklist';
import DocumentVault from './pages/DocumentVault';
import Settings from './pages/Settings';

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-project" element={<NewProjectForm />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/checklist/:id" element={<Checklist />} />
          <Route path="/documents" element={<DocumentVault />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
