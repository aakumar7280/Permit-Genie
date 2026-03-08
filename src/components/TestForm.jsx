import React, { useState } from 'react';

const TestForm = () => {
  const [testValue, setTestValue] = useState('');
  const [permitQuery, setPermitQuery] = useState('');

  return (
    <div className="p-8 bg-slate-800 m-4 rounded-lg">
      <h2 className="text-xl text-white mb-4">Test Form Components</h2>
      
      <div className="mb-4">
        <label className="block text-white mb-2">Test Input 1:</label>
        <input
          type="text"
          value={testValue}
          onChange={(e) => setTestValue(e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
          placeholder="Type here to test..."
        />
        <p className="text-gray-300 mt-2">Current value: {testValue}</p>
      </div>

      <div className="mb-4">
        <label className="block text-white mb-2">Test Permit Search:</label>
        <input
          type="text"
          value={permitQuery}
          onChange={(e) => setPermitQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          placeholder="Search permits..."
        />
        <p className="text-gray-300 mt-2">Permit query: {permitQuery}</p>
      </div>
    </div>
  );
};

export default TestForm;
