import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 bg-clip-text text-transparent">Permit Genie</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Born from frustration, built with determination.
          </p>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/3">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-4xl">👨‍💼</span>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  My Story
                </h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              To simplify permit management for every business owner and contractor
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center border-t-4 border-transparent bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Simplify</h3>
              <p className="text-white/90">
                Make permit discovery and application as simple as a few clicks
              </p>
            </div>
            
            <div className="card p-6 text-center border-t-4 border-transparent bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Accelerate</h3>
              <p className="text-white/90">
                Reduce permit processing time from weeks to days
              </p>
            </div>
            
            <div className="card p-6 text-center border-t-4 border-transparent bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Protect</h3>
              <p className="text-white/90">
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
          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
            Our team combines decades of construction industry experience with cutting-edge technology 
            to deliver solutions that actually work in the real world.
          </p>
          
          <div className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 p-8 rounded-2xl text-white">
            <h3 className="text-xl font-semibold mb-4">Ready to Join Thousands of Satisfied Users?</h3>
            <p className="mb-6 opacity-90">
              Experience the difference that proper permit management can make for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/signup" 
                className="bg-white text-slate-700 hover:bg-gray-100 font-medium px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
              </a>
              <a 
                href="/contact" 
                className="border-2 border-white text-white hover:bg-white hover:text-slate-700 font-medium px-8 py-3 rounded-lg transition-all duration-200"
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
