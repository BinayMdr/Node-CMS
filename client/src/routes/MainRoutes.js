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
const Branch = Loadable(lazy(() => import('pages/module/BranchPage')));
const Product = Loadable(lazy(() => import('pages/module/ProductPage')));
const Payment = Loadable(lazy(() => import('pages/module/PaymentPage')));
const GlobalSetting = Loadable(lazy(() => import('pages/module/GlobalSettingPage')));
const Setting = Loadable(lazy(() => import('pages/module/SettingPage')));
const User = Loadable(lazy(() => import('pages/module/UserPage')));
const EditProfile = Loadable(lazy(() => import('pages/module/EditProfilePage')));
const Invoice = Loadable(lazy(() => import('pages/module/InvoicePage')));

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
      path: 'branch',
      element: <Branch />
    },
    {
      path: 'product',
      element: <Product />
    },
    {
      path: 'payment',
      element: <Payment />
    },
    {
      path: 'global-setting',
      element: <GlobalSetting />
    },
    {
      path: 'setting',
      element: <Setting />
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
      path: 'invoice',
      element: <Invoice />
    }
  ]
};

export default MainRoutes;
