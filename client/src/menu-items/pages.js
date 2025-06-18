// assets
import { LoginOutlined, ProfileOutlined , HomeOutlined,
        SwitcherOutlined} from '@ant-design/icons';
import PaymentIcon from '@mui/icons-material/Payment';

import CategoryIcon from '@mui/icons-material/Category';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import SettingsIcon from '@mui/icons-material/Settings';
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { EmojiPeople } from '../../node_modules/@mui/icons-material/index';
import GroupIcon from '@mui/icons-material/Group';
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
  PersonIcon,
  ReceiptIcon,
  LocalOfferIcon,
  PointOfSaleIcon,
  EmojiPeople,
  GroupIcon
};
// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'modules',
  title: 'Modules',
  type: 'group',
  children: [
     {
      id: 'user',
      title: 'User',
      type: 'item',
      url: '/user',
      forRole: 'View-user',
      forUser: 'Admin',
      icon: icons.PersonIcon
    },
    {
      id: 'group',
      title: 'Group',
      type: 'item',
      url: '/group',
      forRole: 'View-group',
      forUser: 'Admin',
      icon: icons.GroupIcon
    },
    {
      id: 'branch',
      title: 'Branch',
      type: 'item',
      url: '/branch',
      forRole: 'View-branch',
      forUser: 'Admin',
      icon: icons.HomeOutlined
    },
    {
      id: 'product',
      title: 'Product',
      type: 'item',
      url: '/product',
      forRole: 'View-product',
      forUser: 'Admin',
      icon: icons.CategoryIcon
    },
   
    {
      id: 'expenditure',
      title: 'Expenditure',
      type: 'item',
      url: '/expenditure',
      forRole: 'View-expenditure',
      forUser: 'Admin',
      icon: icons.ReceiptIcon
    },
    {
      id: 'invoice',
      title: 'Invoice',
      type: 'item',
      url: '/invoice',
      forRole: 'View-invoice',
      forUser: 'Admin',
      icon: icons.PointOfSaleIcon
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
      forRole: 'View-offer',
      forUser: 'Admin',
      icon: icons.LocalOfferIcon
    },
    {
      id: 'history',
      title: 'History',
      type: 'item',
      url: '/history/:id',
      hide: true,
      icon: icons.LocalOfferIcon
    },
    {
      id: 'customer',
      title: 'Customer',
      type: 'item',
      url: '/customer',
      forUser: 'Admin',
      forRole: 'View-customer',
      icon: icons.EmojiPeople
    },
    {
      id: 'payment',
      title: 'Payment',
      type: 'item',
      url: '/payment',
      forUser: 'Admin',
      forRole: 'View-payment',
      icon: icons.PaymentIcon
    },
    {
      id: 'setting',
      title: 'Setting',
      type: 'item',
      url: '/setting',
      forUser: 'Admin',
      forRole: 'View-setting',
      icon: icons.SettingsIcon
    },
    {
      id: 'globalSetting',
      title: 'Global Setting',
      type: 'item',
      url: '/global-setting',
      forUser: 'Admin',
      forRole: 'View-global-setting',
      icon: icons.PublicIcon
    },
  ]
};

export default pages;
