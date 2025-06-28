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
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ImageIcon from '@mui/icons-material/Image';
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
  InfoIcon,
  FastfoodIcon,
  ImageIcon
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
      forUser: 'All',
      icon: icons.PeopleIcon
    },
      {
      id: 'banner',
      title: 'Banner',
      type: 'item',
      url: '/banner',
      forUser: 'All',
      icon: icons.ImageIcon
    },
    {
      id: 'foodCategory',
      title: 'Food Category',
      type: 'item',
      url: '/food-category',
      forUser: 'All',
      icon: icons.FastfoodIcon
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

    {
      id: 'globalSetting',
      title: 'Global Setting',
      type: 'item',
      url: '/global-setting',
      forUser: 'All',
      icon: icons.PublicIcon
    },

    {
      id: 'foodItem',
      title: 'Food Item',
      type: 'item',
      url: '/food-item/:id',
      forUser: 'All',
      icon: icons.PublicIcon
    },
     
  ]
};

export default pages;
