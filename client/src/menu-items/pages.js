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
      icon: icons.LoginOutlined,
      target: true
    },
    {
      id: 'product',
      title: 'Product',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined,
      target: true
    },
    {
      id: 'inventory',
      title: 'Inventory',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined,
      target: true
    },
    {
      id: 'payment',
      title: 'Payment',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined,
      target: true
    },
    {
      id: 'setting',
      title: 'Setting',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined,
      target: true
    },
    {
      id: 'globalSetting',
      title: 'Global Setting',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined,
      target: true
    }
  ]
};

export default pages;
