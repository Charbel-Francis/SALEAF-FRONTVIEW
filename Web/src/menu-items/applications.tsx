// third-party
import { FormattedMessage } from 'react-intl';

// project-imports
import { NavActionType } from 'config';

// assets (example icons)
import {
  Add,
  Link1,
  KyberNetwork,
  Calendar1,
  ShoppingBag,
  Book,
  DollarSquare,
  UserAdd,
  ClipboardText,
  ArchiveBook,
  TaskSquare
} from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  applications: KyberNetwork, // Generic icon for the group
  calendar: Calendar1, // Calendar icon for the calendar
  ecommerce: ShoppingBag, // Ecommerce-related icon for events
  add: Add, // Add-related tasks
  link: Link1, // Links
  directors: UserAdd, // Representing adding or viewing directors
  donations: DollarSquare, // Representing donations
  banking: ClipboardText, // Banking info related
  manualPayment: Book, // Manual payment
  createAdmin: ArchiveBook, // Admin-related actions
  bursaryList: TaskSquare // Lists (Bursary Applications, Events, etc.)
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications: NavItemType = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.applications,
  type: 'group',
  children: [
    // {
    //   id: 'calendar',
    //   title: <FormattedMessage id="calendar" />,
    //   type: 'item',
    //   url: '/apps/calendar',
    //   icon: icons.calendar,
    //   actions: [
    //     {
    //       type: NavActionType.LINK,
    //       label: 'Full Calendar',
    //       icon: icons.link,
    //       url: 'https://fullcalendar.io/docs/react',
    //       target: true
    //     }
    //   ]
    // },
    {
      id: 'events',
      title: <FormattedMessage id="Events" />,
      type: 'collapse',
      icon: icons.ecommerce,
      children: [
        {
          id: 'event-list',
          title: <FormattedMessage id="event-list" />,
          type: 'item',
          url: '/apps/event/event-list'
        },
        {
          id: 'add-new-event',
          title: <FormattedMessage id="add-new-event" />,
          type: 'item',
          url: '/apps/event/add-new-event'
        }
      ]
    },
    {
      id: 'Directors',
      title: <FormattedMessage id="Directors" />,
      type: 'collapse',
      icon: icons.directors,
      children: [
        {
          id: 'add-new-directors',
          title: <FormattedMessage id="Add New Directors" />,
          type: 'item',
          url: '/apps/directors/add-new-directors'
        },
        {
          id: 'directors-list',
          title: <FormattedMessage id="View all Directors" />,
          type: 'item',
          url: '/apps/directors/list-directors'
        }
      ]
    },
    {
      id: 'Donations',
      title: <FormattedMessage id="Donations" />,
      type: 'collapse',
      icon: icons.donations,
      children: [
        {
          id: 'list-donations',
          title: <FormattedMessage id="Donations" />,
          type: 'item',
          url: '/apps/donations/donations-list'
        }
      ]
    },
    {
      id: 'banking-info',
      title: <FormattedMessage id="Banking Information" />,
      type: 'item',
      url: '/apps/banking-info/banking-info',
      icon: icons.banking
    },
    {
      id: 'manual-payments',
      title: <FormattedMessage id="Manual Payment POP" />,
      type: 'item',
      url: '/apps/manual-payments/manual-payments',
      icon: icons.manualPayment
    },

    {
      id: 'BursaryApplicationList',
      title: <FormattedMessage id="Bursary Application List" />,
      type: 'item',
      url: '/apps/BursaryApplicationList/BursaryApplicationList',
      icon: icons.bursaryList
    },
    {
      id: 'EventRegistrationList',
      title: <FormattedMessage id="Event Registration List" />,
      type: 'item',
      url: '/apps/EventRegistrationList/EventRegistrationList',
      icon: icons.bursaryList
    },
    {
      id: 'studentMarkList',
      title: <FormattedMessage id="Student Mark List" />,
      type: 'item',
      url: '/apps/studentMarkList/studentMarkList',
      icon: icons.bursaryList
    },
    {
      id: 'Admins',
      title: <FormattedMessage id="Admins" />,
      type: 'collapse',
      icon: icons.createAdmin,
      children: [
        {
          id: 'create-admin',
          title: <FormattedMessage id="Create Admin" />,
          type: 'item',
          url: '/apps/create-admin/create-admin',
          icon: icons.createAdmin
        },
        {
          id: 'list-admin',
          title: <FormattedMessage id="List Admin" />,
          type: 'item',
          url: '/apps/list-admin/list-admin',
          icon: icons.createAdmin
        }
      ]
    }
  ]
};

export default applications;
