import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router'

const initSanctum = async () => {
  await fetch('http://127.0.0.1:8000/sanctum/csrf-cookie', {
    credentials: 'include',
  });
};

initSanctum().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
});
