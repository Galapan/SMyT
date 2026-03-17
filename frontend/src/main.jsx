import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Store original fetch
const originalFetch = window.fetch;

// Global fetch interceptor for deactivated accounts
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  
  // Intercept 401 responses to check for account deactivation
  if (response.status === 401) {
    // Clone response to not consume the body for the original caller
    const clonedResponse = response.clone();
    try {
      const data = await clonedResponse.json();
      if (data && data.errorCode === 'ACCOUNT_DEACTIVATED') {
        // User is deactivated: clear session and local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        
        // Set a flag for the login page to show a toast
        localStorage.setItem('account_deactivated_msg', data.message || 'Tu cuenta ha sido desactivada por un administrador.');
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } catch (error) {
      // Ignore JSON parsing errors if not JSON
    }
  }
  
  return response;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
