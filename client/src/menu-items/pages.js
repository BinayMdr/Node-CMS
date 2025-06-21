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
import BrowseGalleryIcon from '@mui/icons-material/BrowseGallery';
import MessageIcon from '@mui/icons-material/Message';
import ReviewsIcon from '@mui/icons-material/Reviews';
import InfoIcon from '@mui/icons-material/Info';

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
  BrowseGalleryIcon,
  MessageIcon,
  ReviewsIcon,
  InfoIcon
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
    },
    {
      id: 'gallery',
      title: 'Gallery',
      type: 'item',
      url: '/gallery',
      forUser: 'All',
      icon: icons.BrowseGalleryIcon
    },
    {
      id: 'message',
      title: 'Message',
      type: 'item',
      url: '/message',
      forUser: 'All',
      icon: icons.MessageIcon
    },
     {
      id: 'customerReview',
      title: 'Customer Review',
      type: 'item',
      url: '/customer-review',
      forUser: 'All',
      icon: icons.ReviewsIcon
    },
     {
      id: 'aboutUs',
      title: 'About Us',
      type: 'item',
      url: '/about-us',
      forUser: 'All',
      icon: icons.InfoIcon
    },
  ]
};

export default pages;
