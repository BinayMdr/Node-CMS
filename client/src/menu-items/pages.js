// assets
import { LoginOutlined, ProfileOutlined , HomeOutlined,
        SwitcherOutlined} from '@ant-design/icons';
import PaymentIcon from '@mui/icons-material/Payment';

import CategoryIcon from '@mui/icons-material/Category';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  HomeOutlined,
  SwitcherOutlined,
  PaymentIcon,
  CategoryIcon,
  SettingsApplicationsIcon
};
// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'branch',
      title: 'Branch',
      type: 'item',
      url: '/branch',
      icon: icons.HomeOutlined
    },
    {
      id: 'product',
      title: 'Product',
      type: 'item',
      url: '/product',
      icon: icons.CategoryIcon
    },
    {
      id: 'payment',
      title: 'Payment',
      type: 'item',
      url: '/payment',
      icon: icons.PaymentIcon
    },
    {
      id: 'inventory',
      title: 'Inventory',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined
    },
  
    {
      id: 'setting',
      title: 'Setting',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined
    },
    {
      id: 'globalSetting',
      title: 'Global Setting',
      type: 'item',
      url: '/global-setting',
      icon: icons.SettingsApplicationsIcon
    }
  ]
};

export default pages;
