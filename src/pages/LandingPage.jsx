import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollGradient from '../components/ScrollGradient';

const LandingPage = () => {
  const features = [
    {
      title: 'Smart Permit Discovery',
      description: 'AI-powered permit identification that analyzes your project details and location to find exactly what you need.',
      icon: '🔍',
      iconGradient: 'icon-gradient-1'
    },
    {
      title: 'Intelligent Deadline Management',
      description: 'Advanced tracking system with predictive analytics and automated notifications to keep you ahead of schedule.',
      icon: '⏰',
      iconGradient: 'icon-gradient-2'
    },
    {
      title: 'Secure Digital Vault',
      description: 'Enterprise-grade document management with blockchain verification and instant accessibility from anywhere.',
      icon: '📁',
      iconGradient: 'icon-gradient-3'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              Find Permits Fast,{' '}
              <span className="gradient-text block">Stay Compliant</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-accent mx-auto mb-8"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Next-generation permit management powered by AI. Streamline compliance, 
            automate workflows, and never miss a deadline again.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link 
              to="/signup" 
              className="btn-primary text-lg group relative"
            >
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              to="/login" 
              className="btn-ghost text-lg"
            >
              Watch Demo
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
            <div className="text-gray-400">
              <div className="text-2xl font-bold text-accent-400 mb-1">10K+</div>
              <div className="text-sm">Projects Managed</div>
            </div>
            <div className="text-gray-400">
              <div className="text-2xl font-bold text-electric-400 mb-1">99.9%</div>
              <div className="text-sm">Compliance Rate</div>
            </div>
            <div className="text-gray-400">
              <div className="text-2xl font-bold text-accent-400 mb-1">24/7</div>
              <div className="text-sm">Expert Support</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Next-Generation{' '}
              <span className="gradient-text-accent">Permit Intelligence</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Advanced AI-driven platform that transforms how contractors and event planners 
              handle permits. Experience the future of compliance management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 text-center group hover:scale-[1.02] animate-float" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="card-content">
                  <div className={`w-20 h-20 mx-auto mb-6 ${feature.iconGradient} rounded-2xl flex items-center justify-center group-hover:animate-pulse-glow transition-all duration-300`}>
                    <span className="text-3xl text-white">{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:gradient-text-accent transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Subtle shine effect */}
                  <div className="mt-6 w-full h-px bg-gradient-border opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to{' '}
            <span className="gradient-text">Transform</span>{' '}
            Your Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the revolution in permit management. Over 10,000 professionals trust our AI-powered platform 
            to streamline compliance and accelerate project delivery.
          </p>
          
          <ScrollGradient className="p-12 text-white">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Experience Next-Generation Permit Intelligence
              </h3>
              <p className="text-lg mb-8 opacity-90 leading-relaxed">
                Get instant access to AI-powered permit discovery, predictive deadline management, 
                and enterprise-grade document security. Start your free trial today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <Link 
                  to="/signup" 
                  className="btn-secondary text-lg"
                >
                  Start Free Trial
                </Link>
                <Link 
                  to="/login" 
                  className="btn-ghost text-lg border-white/30 text-white hover:bg-white/10"
                >
                  Watch Demo
                </Link>
              </div>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-80">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-electric-400 rounded-full"></div>
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </ScrollGradient>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
