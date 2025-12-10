import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router";
import './index.css';
import router from './Routes/Router.jsx';
import AuthProvider from './Context/AuthProvider';

import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

AOS.init();

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position='top-right' reverseOrder={false}></Toaster>
      </AuthProvider>
    </QueryClientProvider>


  </StrictMode>
);
