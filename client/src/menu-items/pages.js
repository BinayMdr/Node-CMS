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
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

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
  LocalOfferIcon,
  PointOfSaleIcon
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
      forUser: 'Admin',
      icon: icons.HomeOutlined
    },
    {
      id: 'product',
      title: 'Product',
      type: 'item',
      url: '/product',
      forUser: 'Admin',
      icon: icons.CategoryIcon
    },
    {
      id: 'payment',
      title: 'Payment',
      type: 'item',
      url: '/payment',
      forUser: 'Admin',
      icon: icons.PaymentIcon
    },
    {
      id: 'user',
      title: 'User',
      type: 'item',
      url: '/user',
      forUser: 'Admin',
      icon: icons.PeopleIcon
    },
    {
      id: 'setting',
      title: 'Setting',
      type: 'item',
      url: '/setting',
      forUser: 'Admin',
      icon: icons.SettingsIcon
    },
    {
      id: 'globalSetting',
      title: 'Global Setting',
      type: 'item',
      url: '/global-setting',
      forUser: 'Admin',
      icon: icons.PublicIcon
    },
    {
      id: 'invoice',
      title: 'Invoice',
      type: 'item',
      url: '/invoice',
      forUser: 'All',
      icon: icons.PointOfSaleIcon
    },
    {
      id: 'expenditure',
      title: 'Expenditure',
      type: 'item',
      url: '/expenditure',
      forUser: 'All',
      icon: icons.ReceiptIcon
    },
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      type: 'item',
      url: '/edit-profile',
      icon: icons.PublicIcon
    },
    {
      id: 'offer',
      title: 'Offer',
      type: 'item',
      url: '/offer',
      forUser: 'Admin',
      icon: icons.LocalOfferIcon
    },
    {
      id: 'history',
      title: 'History',
      type: 'item',
      url: '/history/:id',
      forUser: 'Admin',
      icon: icons.LocalOfferIcon
    },
  ]
};

export default pages;
