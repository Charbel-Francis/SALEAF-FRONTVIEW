// third-party
import { FormattedMessage } from 'react-intl';

// project-imports
import { NavActionType } from 'config';

// assets
import { Add, Link1, KyberNetwork, Calendar1, ShoppingBag } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  applications: KyberNetwork,
  calendar: Calendar1,
  ecommerce: ShoppingBag,
  add: Add,
  link: Link1
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications: NavItemType = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.applications,
  type: 'group',
  children: [
    {
      id: 'calendar',
      title: <FormattedMessage id="calendar" />,
      type: 'item',
      url: '/apps/calendar',
      icon: icons.calendar,
      actions: [
        {
          type: NavActionType.LINK,
          label: 'Full Calendar',
          icon: icons.link,
          url: 'https://fullcalendar.io/docs/react',
          target: true
        }
      ]
    },
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
      icon: icons.add,
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
      icon: icons.link,
      children: [
        {
          id: 'list-donatinos',
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
      icon: icons.add
    },
    {
      id: 'manual-payments',
      title: <FormattedMessage id="Manual Payment" />,
      type: 'item',
      url: '/apps/manual-payments/manual-payments',
      icon: icons.add
    }
  ]
};

export default applications;
