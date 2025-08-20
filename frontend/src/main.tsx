import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router'
import { AuthProvider } from './context/AuthContext'

const initSanctum = async () => {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  const sanctumURL = baseURL.replace('/api', '/sanctum/csrf-cookie');
  
  try {
    await fetch(sanctumURL, {
      credentials: 'include',
    });
  } catch (error) {
    console.warn('Failed to initialize sanctum:', error);
  }
};

initSanctum().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>
  );
});
