import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authAPI } from '../services/api';

const UpgradePage = () => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    // In a real app, this would integrate with Stripe or similar
    alert('Premium upgrade functionality would be implemented here with payment processing.');
  };

  const pricingFeatures = {
    free: [
      'Search permits (unlimited)',
      'Project management',
      '1 free permit application',
      'Basic project analysis',
      'Document storage (5 files)'
    ],
    premium: [
      'Everything in Free',
      'Unlimited permit applications',
      'Priority customer support',
      'Advanced project analytics',
      'Unlimited document storage',
      'Integration with government APIs',
      'Team collaboration features',
      'Export reports and documentation'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header />
      
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Upgrade to{' '}
              <span className="gradient-text">Premium</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Unlock unlimited permit applications and premium features to streamline 
              your compliance workflow.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {/* Free Plan */}
            <div className="card p-8 border-2 border-gray-600">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
                <div className="text-4xl font-bold text-gray-400 mb-4">
                  $0<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-400">Perfect for occasional users</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {pricingFeatures.free.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                disabled
                className="w-full py-3 px-6 bg-gray-600 text-gray-400 rounded-lg font-medium cursor-not-allowed"
              >
                Current Plan
              </button>
            </div>

            {/* Premium Plan */}
            <div className="card p-8 border-2 border-gradient-accent relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-accent text-white px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Premium Plan</h3>
                <div className="text-4xl font-bold gradient-text mb-4">
                  $29<span className="text-lg text-gray-500">/month</span>
                </div>
                <p className="text-gray-400">For professionals and businesses</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {pricingFeatures.premium.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-accent-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={handleUpgrade}
                className="w-full btn-primary text-lg py-4"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  What happens to my free permit application?
                </h3>
                <p className="text-gray-300">
                  Your free permit application allowance resets when you upgrade to Premium. 
                  You'll then have unlimited permit applications for as long as you maintain 
                  your Premium subscription.
                </p>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Can I cancel my Premium subscription anytime?
                </h3>
                <p className="text-gray-300">
                  Yes! You can cancel your Premium subscription at any time. You'll continue 
                  to have Premium access until the end of your current billing period, then 
                  automatically revert to the Free plan.
                </p>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Do you offer annual discounts?
                </h3>
                <p className="text-gray-300">
                  Yes! Annual Premium subscriptions are available at $290/year (equivalent to 
                  $24.17/month), saving you 16% compared to monthly billing.
                </p>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Is there a free trial for Premium?
                </h3>
                <p className="text-gray-300">
                  We offer a 14-day free trial of Premium features. No credit card required 
                  to start your trial - just upgrade from your dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="card p-12 bg-gradient-to-br from-slate-800 to-slate-900">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to streamline your permit process?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who trust Permit Genie for their compliance needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleUpgrade}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Start Premium Trial
                </button>
                <Link
                  to="/dashboard"
                  className="btn-ghost text-lg px-8 py-4"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UpgradePage;
