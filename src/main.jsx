import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router";
import './index.css';
import router from './Routes/Router.jsx';
import AuthProvider from './Context/AuthProvider';

import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
