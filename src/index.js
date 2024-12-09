import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' instead
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>  {/* Wrap your App with BrowserRouter */}
    <App />
  </BrowserRouter>
);
