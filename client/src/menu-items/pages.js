// assets
import { LoginOutlined, ProfileOutlined , HomeOutlined,
        SwitcherOutlined} from '@ant-design/icons';
import PaymentIcon from '@mui/icons-material/Payment';

import CategoryIcon from '@mui/icons-material/Category';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import SettingsIcon from '@mui/icons-material/Settings';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

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
  PeopleIcon,
  ReceiptIcon,
  LocalOfferIcon
};
// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'modules',
  title: 'Modules',
  type: 'group',
  children: [
    {
      id: 'product',
      title: 'Product',
      type: 'item',
      url: '/product',
      forUser: 'All',
      icon: icons.CategoryIcon
    },
    {
      id: 'user',
      title: 'User',
      type: 'item',
      url: '/user',
      forUser: 'All',
      icon: icons.PeopleIcon
    },
    
    {
      id: 'globalSetting',
      title: 'Global Setting',
      type: 'item',
      url: '/global-setting',
      forUser: 'All',
      icon: icons.PublicIcon
    },
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      type: 'item',
      url: '/edit-profile',
      icon: icons.PublicIcon
    }
  ]
};

export default pages;
