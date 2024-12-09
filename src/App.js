import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Removed BrowserRouter import
import Navbar from './Components/Navbar';
import News from './Components/News';
import './App.css'; // Ensure the path is correct

const App = () => {
  const [mode, setMode] = useState('light'); // State for dark/light mode

  // Toggle function for dark/light mode
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`container ${mode === 'dark' ? 'bg-dark text-white' : ''}`}>
      <Navbar mode={mode} toggleMode={toggleMode} />
      <Routes>
        {/* Redirect root to /home */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Home Route - Displays Trending News */}
        <Route path="/home" element={<News category="general" pageSize={24} country="US" mode={mode} />} />
        
        {/* Routes for specific categories */}
        <Route path="/sports" element={<News category="sports" pageSize={24} country="US" mode={mode} />} />
        <Route path="/business" element={<News category="business" pageSize={24} country="US" mode={mode} />} />
        <Route path="/entertainment" element={<News category="entertainment" pageSize={24} country="US" mode={mode} />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
};

export default App;
