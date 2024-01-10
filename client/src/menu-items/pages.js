// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
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
      url: '/login',
      icon: icons.LoginOutlined
    },
    {
      id: 'product',
      title: 'Product',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined
    },
    {
      id: 'inventory',
      title: 'Inventory',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined
    },
    {
      id: 'payment',
      title: 'Payment',
      type: 'item',
      url: '/color',
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
      url: '/register',
      icon: icons.ProfileOutlined
    }
  ]
};

export default pages;
