import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollGradient from '../components/ScrollGradient';

const LandingPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const suggestions = [
    { label: 'Kitchen renovation', icon: '🍳' },
    { label: 'Deck construction', icon: '🪵' },
    { label: 'Home addition', icon: '🏠' },
    { label: 'Electrical work', icon: '⚡' },
    { label: 'Fence installation', icon: '🚧' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/permits?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestion = (label) => {
    navigate(`/permits?q=${encodeURIComponent(label)}`);
  };

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
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <Header light />

      {/* ── Hero Section ── */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '96px',
          paddingBottom: '80px',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Warm blob background */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70vw',
            height: '45vh',
            background: 'radial-gradient(ellipse at center, rgba(241,80,37,0.15) 0%, rgba(241,80,37,0.06) 50%, transparent 75%)',
            filter: 'blur(32px)',
            pointerEvents: 'none',
            borderRadius: '50%',
          }}
        />

        <div className="relative w-full max-w-3xl mx-auto px-4 text-center">
          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 4rem)',
              fontWeight: 800,
              color: '#191919',
              lineHeight: 1.15,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
            Permits for your next{' '}
            <span style={{ color: '#F15025', fontStyle: 'italic' }}>Project</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '1.05rem',
              color: '#6b7280',
              marginBottom: '2.2rem',
              fontWeight: 400,
            }}
          >
            Describe what you want to build — we'll find every permit you need.
          </p>

          {/* Search box */}
          <form onSubmit={handleSearch}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#ffffff',
                border: '1.5px solid #E6E8E6',
                borderRadius: '999px',
                padding: '6px 8px 6px 22px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                maxWidth: '620px',
                margin: '0 auto',
              }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. I want to build a deck in my backyard"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.97rem',
                  color: '#191919',
                  background: 'transparent',
                  paddingRight: '12px',
                }}
              />
              <button
                type="submit"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#191919',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F15025'}
                onMouseLeave={e => e.currentTarget.style.background = '#191919'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>

          {/* Suggestion chips */}
          <div style={{ marginTop: '1.6rem' }}>
            <p style={{ fontSize: '0.82rem', color: '#CED0CE', marginBottom: '0.9rem' }}>
              Need inspiration? Try one of these
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSuggestion(s.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 16px',
                    borderRadius: '999px',
                    border: '1.5px solid #E6E8E6',
                    background: '#ffffff',
                    color: '#191919',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#F15025';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(241,80,37,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#E6E8E6';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#E6E8E6' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#191919', marginBottom: '12px' }}>
              Everything you need to stay{' '}
              <span style={{ color: '#F15025' }}>compliant</span>
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#6b7280', maxWidth: '560px', margin: '0 auto' }}>
              Built for contractors, homeowners, and developers who need answers fast.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '32px 28px',
                  textAlign: 'center',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(241,80,37,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ fontSize: '2.4rem', marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#191919', marginBottom: '10px' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#6b7280', lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
        <div
          style={{
            maxWidth: '700px',
            margin: '0 auto',
            textAlign: 'center',
            background: '#191919',
            borderRadius: '24px',
            padding: '56px 40px',
            color: '#ffffff',
          }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>
            Ready to find your permits?
          </h2>
          <p style={{ fontSize: '1rem', opacity: 0.85, marginBottom: '32px', lineHeight: 1.6 }}>
            Join thousands of contractors and homeowners who use Permit Genie to stay
            compliant and save time on every project.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
            <Link
              to="/signup"
              style={{
                padding: '12px 28px',
                borderRadius: '999px',
                background: '#F15025',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              Start Free Trial
            </Link>
            <Link
              to="/permits"
              style={{
                padding: '12px 28px',
                borderRadius: '999px',
                border: '1.5px solid rgba(255,255,255,0.3)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              Browse Permits
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', fontSize: '0.82rem', opacity: 0.7 }}>
            <span>✓ No credit card required</span>
            <span>✓ 14-day free trial</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

