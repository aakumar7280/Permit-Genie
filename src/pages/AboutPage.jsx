import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#191919' }}>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span style={{ color: '#F15025' }}>Permit Genie</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#CED0CE' }}>
            Born from frustration, built with determination.
          </p>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl p-8 md:p-12" style={{ backgroundColor: '#222222', border: '1px solid #333' }}>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/3">
                <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: '#F15025' }}>
                  <span className="text-white text-4xl">👨‍💼</span>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  My Story
                </h2>
                <div className="space-y-4 leading-relaxed" style={{ color: '#CED0CE' }}>
                  <p>
                    I was absolutely fed up with the nightmare of finding and managing permits for my business. 
                    Every project meant hours of research, countless phone calls to different departments, and 
                    navigating through confusing government websites just to figure out what permits I needed.
                  </p>
                  <p>
                    The breaking point came when I spent three weeks trying to get permits for a simple restaurant 
                    renovation, only to discover I had missed two crucial permits that could have shut down the 
                    entire project. I realized that if I was struggling with this as an experienced contractor, 
                    thousands of other business owners must be facing the same frustrations.
                  </p>
                  <p>
                    That's when I decided to build Permit Genie. I wanted to create the solution I wished existed – 
                    a platform that would eliminate the guesswork, streamline the process, and help business owners 
                    stay compliant without the headaches.
                  </p>
                  <p className="font-medium text-white">
                    Today, Permit Genie helps thousands of contractors, event planners, and business owners 
                    navigate the complex world of permits with confidence and ease.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#222222' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Mission
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#CED0CE' }}>
              To simplify permit management for every business owner and contractor
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#2d2d2d', border: '1px solid #444', borderTop: '4px solid #F15025' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F15025' }}>
                <span className="text-2xl text-white">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Simplify</h3>
              <p style={{ color: '#CED0CE' }}>
                Make permit discovery and application as simple as a few clicks
              </p>
            </div>
            
            <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#2d2d2d', border: '1px solid #444', borderTop: '4px solid #F15025' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F15025' }}>
                <span className="text-2xl text-white">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Accelerate</h3>
              <p style={{ color: '#CED0CE' }}>
                Reduce permit processing time from weeks to days
              </p>
            </div>
            
            <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#2d2d2d', border: '1px solid #444', borderTop: '4px solid #F15025' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F15025' }}>
                <span className="text-2xl text-white">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Protect</h3>
              <p style={{ color: '#CED0CE' }}>
                Ensure compliance and avoid costly project delays
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Built by People Who Understand
          </h2>
          <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ color: '#CED0CE' }}>
            Our team combines decades of construction industry experience with cutting-edge technology 
            to deliver solutions that actually work in the real world.
          </p>
          
          <div className="p-8 rounded-2xl text-white" style={{ backgroundColor: '#2d2d2d', border: '1px solid #444' }}>
            <h3 className="text-xl font-semibold mb-4">Ready to Join Thousands of Satisfied Users?</h3>
            <p className="mb-6" style={{ color: '#CED0CE' }}>
              Experience the difference that proper permit management can make for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/signup" 
                className="font-medium px-8 py-3 rounded-lg transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: '#F15025', color: '#FFFFFF' }}
              >
                Start Free Trial
              </a>
              <a 
                href="/contact" 
                className="font-medium px-8 py-3 rounded-lg transition-all duration-200"
                style={{ border: '2px solid #F15025', color: '#F15025' }}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
