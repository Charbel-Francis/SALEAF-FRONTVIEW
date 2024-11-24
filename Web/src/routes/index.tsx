import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// project-imports
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import ComponentsRoutes from './ComponentsRoutes';

import { SimpleLayoutType } from 'config';
import SimpleLayout from 'layout/Simple';
import Loadable from 'components/Loadable';

// render - landing page
const PagesLanding = Loadable(lazy(() => import('pages/landing')));

// ==============================|| ROUTES RENDER ||============================== //

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/login" replace />
    },
    LoginRoutes, 
    ComponentsRoutes, 
    MainRoutes
  ], 
  { 
    basename: import.meta.env.VITE_APP_BASE_NAME 
  }
);

export default router;
