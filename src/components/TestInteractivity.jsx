import React, { useState } from 'react';

const TestInteractivity = () => {
  const [testInput, setTestInput] = useState('');
  const [clickCount, setClickCount] = useState(0);

  const handleInputChange = (e) => {
    console.log('TEST INPUT CHANGE:', e.target.value);
    setTestInput(e.target.value);
  };

  const handleButtonClick = () => {
    console.log('TEST BUTTON CLICKED');
    setClickCount(prev => prev + 1);
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#ff0000', 
      margin: '20px',
      border: '3px solid white',
      borderRadius: '10px'
    }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>
        🚨 INTERACTIVITY TEST COMPONENT 🚨
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: 'white', display: 'block', marginBottom: '10px' }}>
          Test Input (Should work):
        </label>
        <input
          type="text"
          value={testInput}
          onChange={handleInputChange}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '2px solid black',
            borderRadius: '5px'
          }}
          placeholder="Type here to test React state..."
        />
        <p style={{ color: 'yellow', marginTop: '10px' }}>
          Current value: "{testInput}" (Length: {testInput.length})
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleButtonClick}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Click Test (Clicked {clickCount} times)
        </button>
      </div>

      <div style={{ color: 'white' }}>
        <p>✅ If you can type above and see this text change, React state is working</p>
        <p>✅ If you can click the button and see count increase, event handling is working</p>
        <p>❌ If nothing works, there's a fundamental React/JS issue</p>
      </div>
    </div>
  );
};

export default TestInteractivity;
