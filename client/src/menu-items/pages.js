// assets
import { LoginOutlined, ProfileOutlined , HomeOutlined,
        SwitcherOutlined} from '@ant-design/icons';
import PaymentIcon from '@mui/icons-material/Payment';

import CategoryIcon from '@mui/icons-material/Category';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import SettingsIcon from '@mui/icons-material/Settings';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  HomeOutlined,
  SwitcherOutlined,
  PaymentIcon,
  CategoryIcon,
  SettingsApplicationsIcon,
  SettingsIcon,
  PublicIcon,
  PeopleIcon
};
// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'modules',
  title: 'Modules',
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
      id: 'user',
      title: 'User',
      type: 'item',
      url: '/user',
      icon: icons.PeopleIcon
    },
  
    {
      id: 'setting',
      title: 'Setting',
      type: 'item',
      url: '/setting',
      icon: icons.SettingsIcon
    },
    {
      id: 'globalSetting',
      title: 'Global Setting',
      type: 'item',
      url: '/global-setting',
      icon: icons.PublicIcon
    }
  ]
};

export default pages;
