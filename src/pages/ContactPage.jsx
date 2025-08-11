import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    contactMethod: 'email',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
      contactMethod: 'email',
    });
    
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      detail: 'support@permitgenie.com',
      description: 'Send us an email anytime',
      gradient: 'from-slate-500 to-slate-600'
    },
    {
      icon: '📞',
      title: 'Phone',
      detail: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm PST',
      gradient: 'from-slate-500 to-slate-600'
    },
    {
      icon: '📍',
      title: 'Office',
      detail: '123 Business Blvd, Suite 100',
      description: 'San Francisco, CA 94105',
      gradient: 'from-slate-500 to-slate-600'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      detail: 'Available 24/7',
      description: 'Get instant help on our website',
      gradient: 'from-slate-500 to-slate-600'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get in <span className="bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about permits? Need help with your project? We're here to help you succeed.
          </p>
        </div>
      </section>
      
      {/* Contact Info Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${info.gradient} rounded-full flex items-center justify-center`}>
                  <span className="text-2xl text-white">{info.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{info.title}</h3>
                <p className="font-medium text-gray-300 mb-1">{info.detail}</p>
                <p className="text-sm text-gray-400">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Send Us a Message
            </h2>
            <p className="text-lg text-gray-300">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
          
          <div className="card p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              {/* Contact Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              {/* Company & Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter your company name"
                  />
                </div>
                
                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="What can we help you with?"
                  />
                </div>
              </div>
              
              {/* Preferred Contact Method */}
              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Preferred Contact Method *
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="email"
                      checked={formData.contactMethod === 'email'}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-600"
                    />
                    <span className="ml-2 text-sm text-gray-300">Email</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="phone"
                      checked={formData.contactMethod === 'phone'}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-600"
                    />
                    <span className="ml-2 text-sm text-gray-300">Phone</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="either"
                      checked={formData.contactMethod === 'either'}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-600"
                    />
                    <span className="ml-2 text-sm text-gray-300">Either</span>
                  </label>
                </div>
              </div>
              
              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Tell us about your project and how we can help..."
                />
              </div>
              
              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-12 py-4 rounded-lg font-medium text-lg transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 shadow-lg hover:shadow-xl hover:scale-105'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-300">
              Quick answers to common questions about Permit Genie
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-3">How quickly can I get permit information?</h3>
              <p className="text-gray-300">Most permit requirements are available instantly. Our system analyzes your project details and location to provide comprehensive permit lists in seconds.</p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Do you support permits nationwide?</h3>
              <p className="text-gray-300">Yes! We have permit databases for all 50 states and thousands of local jurisdictions. Our coverage is continuously expanding.</p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Can I get help with permit applications?</h3>
              <p className="text-gray-300">Absolutely! Our expert support team can guide you through the application process, review your documents, and ensure everything is submitted correctly.</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
