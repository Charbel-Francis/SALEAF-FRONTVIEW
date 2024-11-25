import { lazy } from 'react';

// project-imports
import ErrorBoundary from './ErrorBoundary';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import SimpleLayout from 'layout/Simple';

import { SimpleLayoutType } from 'config';
import { loader as eventListLoader } from 'pages/apps/event/events-list';
import AddDirectors from 'pages/apps/directors/AddDirectors';
// import ListDirectors from 'pages/apps/directors/ListDirectors';
import ListDonations from 'pages/apps/donations/ListDonations';
import { Path } from '@react-pdf/renderer';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - event pages
const EventList = Loadable(lazy(() => import('pages/apps/event/events-list')));
const AddEvent = Loadable(lazy(() => import('pages/apps/event/add-event')));
const EventView = Loadable(lazy(() => import('sections/apps/event/event-list/EventView')));
const EditEvent = Loadable(lazy(() => import('pages/apps/event/edit-event')));

const ListDirectors = Loadable(lazy(() => import('pages/apps/directors/ListDirectors')));
const AppListDonations = Loadable(lazy(() => import('pages/apps/donations/ListDonations')));
const AppBankInfo = Loadable(lazy(() => import('pages/apps/banking-info/BankingInformation')));

const ManualPayment = Loadable(lazy(() => import('pages/apps/manual-payments/ListManualPayment')));
const Calendar = Loadable(lazy(() => import('pages/apps/calendar')));
// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'dashboard',
          children: [
            {
              path: 'default',
              element: <DashboardDefault />
            }
          ]
        },

        {
          path: 'apps',
          children: [
            {
              path: 'event',
              children: [
                {
                  path: 'event-list',
                  element: <EventList />,
                  loader: eventListLoader
                },
                {
                  path: 'add-new-event',
                  element: <AddEvent />
                },
                {
                  path: 'edit-event/:eventId',
                  element: <EditEvent />
                },
                {
                  path: ':id',
                  element: <EventView />
                }
              ]
            },
            { path: 'calendar', element: <Calendar />, loader: eventListLoader },
            {
              path: 'directors',
              children: [
                {
                  path: 'event-list',
                  element: <EventList />,
                  loader: eventListLoader
                },
                {
                  path: 'add-new-directors',
                  element: <AddDirectors />
                },
                {
                  path: 'list-directors',
                  element: <ListDirectors />
                }
              ]
            },
            {
              path: 'donations',
              children: [
                {
                  path: 'donations-list',
                  element: <AppListDonations />,
                  loader: eventListLoader
                }
              ]
            },
            {
              path: 'banking-info',
              children: [
                {
                  path: 'banking-info',
                  element: <AppBankInfo />,
                  loader: eventListLoader
                }
              ]
            },
            {
              path: 'manual-payments',
              children: [
                {
                  path: 'manual-payments',
                  element: <ManualPayment />,
                  loader: eventListLoader
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
