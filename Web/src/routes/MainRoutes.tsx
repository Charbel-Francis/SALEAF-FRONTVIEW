import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import { loader as eventListLoader } from 'pages/apps/event/events-list';
import AddDirectors from 'pages/apps/directors/AddDirectors';
// import ListDirectors from 'pages/apps/directors/ListDirectors';
import AuthGuard from 'utils/route-guard/AuthGuard';

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
// const Calendar = Loadable(lazy(() => import('pages/apps/calendar')));
const CreateAdmin = Loadable(lazy(() => import('pages/apps/createAdmin/CreateAdmin')));
const ListBursaryApplication = Loadable(lazy(() => import('pages/apps/bursayapplicaiton/BursaryApplicationList')));
const EventRegistrationList = Loadable(lazy(() => import('pages/apps/eventRegistration/EventRegistration')));
const StudentMarkList = Loadable(lazy(() => import('pages/apps/studentMarkList/StudentMarkList')));
const ListAllAdmins = Loadable(lazy(() => import('pages/apps/createAdmin/ListAdmin')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
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
            },
            {
              path: 'create-admin',
              children: [
                {
                  path: 'create-admin',
                  element: <CreateAdmin />,
                  loader: eventListLoader
                }
              ]
            },
            {
              path: 'BursaryApplicationList',
              children: [
                {
                  path: 'BursaryApplicationList',
                  element: <ListBursaryApplication />,
                  loader: eventListLoader
                }
              ]
            },
            {
              path: 'EventRegistrationList',
              children: [
                {
                  path: 'EventRegistrationList',
                  element: <EventRegistrationList />,
                  loader: eventListLoader
                }
              ]
            },
            {
              path: 'studentMarkList',
              children: [
                {
                  path: 'studentMarkList',
                  element: <StudentMarkList />,
                  loader: eventListLoader
                }
              ]
            },
            {
              path: 'list-admin',
              children: [
                {
                  path: 'list-admin',
                  element: <ListAllAdmins />,
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
