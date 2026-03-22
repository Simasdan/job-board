import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import './index.css';
import './styles/index.scss';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position='top-right' richColors />
    </AuthProvider>
  </React.StrictMode>
)
