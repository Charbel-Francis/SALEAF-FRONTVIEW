import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// project-imports
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

import { SimpleLayoutType } from 'config';
import SimpleLayout from 'layout/Simple';
import Loadable from 'components/Loadable';

// render - landing page
const PagesLanding = Loadable(lazy(() => import('pages/landing')));
const Donate = Loadable(lazy(() => import('pages/donate/Donate')));
const BursaryApplicationForm = Loadable(lazy(() => import('pages/applicationform/Busary_Applicaition')));
const DeleteAccountPage = Loadable(lazy(() => import('pages/DeleteAccount/DeleteAccount')));
// ==============================|| ROUTES RENDER ||============================== //

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.LANDING} />,
      children: [
        {
          index: true,
          element: <PagesLanding />
        },
        { path: '/donate', element: <Donate /> },
        {
          path: '/application_form',
          element: <BursaryApplicationForm />
        },
        { path: '/delete_account', element: <DeleteAccountPage /> }
      ]
    },

    LoginRoutes,
    MainRoutes
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME }
);

export default router;
