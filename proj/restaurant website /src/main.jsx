import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/animations.css';
import './utils/analytics';  // Import analytics configuration
import axios from 'axios';

// Set default axios configuration
axios.defaults.baseURL = 'http://localhost:5001';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear session data on authentication error
      localStorage.removeItem('sessionData');
      localStorage.removeItem('isLoggedIn');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// If there's a token in localStorage, set it in axios defaults
const sessionData = localStorage.getItem('sessionData');
if (sessionData) {
  try {
    const { token, timestamp } = JSON.parse(sessionData);
    const loginTime = new Date(timestamp);
    const now = new Date();
    const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);

    if (hoursSinceLogin < 24) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('sessionData');
      localStorage.removeItem('isLoggedIn');
    }
  } catch (error) {
    console.error('Error parsing session data:', error);
    localStorage.removeItem('sessionData');
    localStorage.removeItem('isLoggedIn');
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);