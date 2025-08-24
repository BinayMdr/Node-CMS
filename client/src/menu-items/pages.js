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
import HomeIcon from '@mui/icons-material/Home';
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
  PeopleIcon,
  ReceiptIcon,
  LocalOfferIcon,
  BrowseGalleryIcon,
  MessageIcon,
  ReviewsIcon,
  InfoIcon,
  FastfoodIcon,
  ImageIcon,
  HomeIcon,
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
      icon: icons.PeopleIcon
    },
    {
      id: 'group',
      title: 'Group',
      type: 'item',
      url: '/group',
      forRole: 'View-group',
      icon: icons.GroupIcon
    },


      {
      id: 'banner',
      title: 'Banner',
      type: 'item',
      url: '/banner',
      forRole: 'View-banner',
      icon: icons.ImageIcon
    },
    {
      id: 'foodCategory',
      title: 'Food Category',
      type: 'item',
      url: '/food-category',
      forRole: 'View-food-category',
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
      forRole: 'View-gallery',
      icon: icons.BrowseGalleryIcon
    },
    {
      id: 'message',
      title: 'Message',
      type: 'item',
      url: '/message',
      forRole: 'View-message',
      icon: icons.MessageIcon
    },
     {
      id: 'customerReview',
      title: 'Customer Review',
      type: 'item',
      url: '/customer-review',
      forRole: 'View-customer-review',
      icon: icons.ReviewsIcon
    },
     {
      id: 'Home',
      title: 'Home',
      type: 'item',
      url: '/home',
      forRole: 'View-home',
      icon: icons.HomeIcon
    },
     
     {
      id: 'aboutUs',
      title: 'About Us',
      type: 'item',
      url: '/about-us',
      forRole: 'View-about-us',
      icon: icons.InfoIcon
    },

    {
      id: 'globalSetting',
      title: 'Global Setting',
      type: 'item',
      url: '/global-setting',
      forRole: 'View-global-setting',
      icon: icons.PublicIcon
    },

    {
      id: 'foodItem',
      title: 'Food Item',
      type: 'item',
      url: '/food-item/:id',
      hide:true,
      icon: icons.PublicIcon
    },

  ]
};

export default pages;
