import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
// const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
// const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));
const Product = Loadable(lazy(() => import('pages/module/ProductPage')));
const GlobalSetting = Loadable(lazy(() => import('pages/module/GlobalSettingPage')));
const User = Loadable(lazy(() => import('pages/module/UserPage')));
const EditProfile = Loadable(lazy(() => import('pages/module/EditProfilePage')));
const Gallery = Loadable(lazy(() => import('pages/module/GalleryPage')));
const Message = Loadable(lazy(() => import('pages/module/MessagePage')));
const CustomerReview = Loadable(lazy(() => import('pages/module/CustomerReviewPage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'product',
      element: <Product />
    },
    {
      path: 'global-setting',
      element: <GlobalSetting />
    },

    {
      path: 'user',
      element: <User />
    },
    {
      path: 'edit-profile',
      element: <EditProfile />
    },
    {
      path: 'gallery',
      element: <Gallery />
    },
    {
      path: 'message',
      element: <Message />
    },
    {
      path: 'customer-review',
      element: <CustomerReview />
    },

  ]
};

export default MainRoutes;
