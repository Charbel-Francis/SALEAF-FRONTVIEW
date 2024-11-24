// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Story, Fatrows, PresentionChart } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  widgets: Story,
  statistics: Story,
  data: Fatrows,
  chart: PresentionChart
};

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const widget: NavItemType = {
  id: 'group-widget',
  title: <FormattedMessage id="Dashboard" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'statistics',
      title: <FormattedMessage id="Dashboard" />,
      type: 'item',
      url: '/dashboard/default',
      icon: icons.statistics
    }
  ]
};

export default widget;
