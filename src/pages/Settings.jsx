import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const Settings = () => {
  const [formData, setFormData] = useState({
    businessName: 'ABC Construction Company',
    contactName: 'John Smith',
    email: 'john@abcconstruction.com',
    phone: '(555) 123-4567',
    address: '123 Builder Lane',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    licenseNumber: 'CA-LIC-123456',
    taxId: '12-3456789',
    website: 'www.abcconstruction.com',
  });

  const [notifications, setNotifications] = useState({
    emailDeadlines: true,
    emailUpdates: true,
    smsDeadlines: false,
    smsUpdates: false,
  });

  const [activeTab, setActiveTab] = useState('profile');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd make an API call here
    console.log('Settings updated:', { formData, notifications });
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Business Profile', icon: '🏢' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'billing', label: 'Billing', icon: '💳' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Settings Navigation */}
          <div className="lg:w-64">
            <div className="card p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3 text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="card p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Profile</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        id="businessName"
                        name="businessName"
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Name *
                      </label>
                      <input
                        id="contactName"
                        name="contactName"
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code
                      </label>
                      <input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        License Number
                      </label>
                      <input
                        id="licenseNumber"
                        name="licenseNumber"
                        type="text"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-2">
                        Tax ID
                      </label>
                      <input
                        id="taxId"
                        name="taxId"
                        type="text"
                        value={formData.taxId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-gradient px-8 py-3"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Deadline Reminders</h4>
                          <p className="text-sm text-gray-600">Get notified about upcoming permit deadlines</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="emailDeadlines"
                            checked={notifications.emailDeadlines}
                            onChange={handleNotificationChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-slate-600 peer-checked:via-slate-700 peer-checked:to-slate-800"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Project Updates</h4>
                          <p className="text-sm text-gray-600">Receive updates on project status changes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="emailUpdates"
                            checked={notifications.emailUpdates}
                            onChange={handleNotificationChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-400 peer-checked:via-purple-500 peer-checked:to-red-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Urgent Deadlines</h4>
                          <p className="text-sm text-gray-600">Text alerts for critical deadlines (within 3 days)</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="smsDeadlines"
                            checked={notifications.smsDeadlines}
                            onChange={handleNotificationChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-400 peer-checked:via-purple-500 peer-checked:to-red-500"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Status Updates</h4>
                          <p className="text-sm text-gray-600">SMS alerts for permit approvals and rejections</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="smsUpdates"
                            checked={notifications.smsUpdates}
                            onChange={handleNotificationChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-400 peer-checked:via-purple-500 peer-checked:to-red-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => console.log('Notification settings saved:', notifications)}
                  className="btn-gradient px-8 py-3 mt-8"
                >
                  Save Preferences
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="card p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>
                      <button className="btn-gradient px-6 py-3">
                        Update Password
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <p className="text-gray-600 mb-4">
                      Add an extra layer of security to your account with two-factor authentication.
                    </p>
                    <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h3>
                    <p className="text-gray-600 mb-4">
                      Manage where you're signed in to your account.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Current Session</p>
                          <p className="text-sm text-gray-600">MacBook Pro • San Francisco, CA • Chrome</p>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="card p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing & Subscription</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h3>
                    <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Professional Plan</h4>
                          <p className="text-gray-600">Unlimited projects and advanced features</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">$49</p>
                          <p className="text-gray-600">per month</p>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <button className="btn-gradient px-6 py-2 text-sm">
                          Upgrade Plan
                        </button>
                        <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                          Change Plan
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-bold">VISA</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-600">Expires 12/2026</p>
                          </div>
                        </div>
                        <button className="text-purple-600 hover:text-purple-500 text-sm font-medium">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <div className="flex justify-between font-medium text-gray-900">
                          <span>Date</span>
                          <span>Amount</span>
                          <span>Status</span>
                          <span>Invoice</span>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        <div className="px-6 py-4 flex justify-between items-center">
                          <span className="text-gray-900">Aug 1, 2025</span>
                          <span className="text-gray-900">$49.00</span>
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>
                          <button className="text-purple-600 hover:text-purple-500 text-sm">Download</button>
                        </div>
                        <div className="px-6 py-4 flex justify-between items-center">
                          <span className="text-gray-900">Jul 1, 2025</span>
                          <span className="text-gray-900">$49.00</span>
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>
                          <button className="text-purple-600 hover:text-purple-500 text-sm">Download</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
