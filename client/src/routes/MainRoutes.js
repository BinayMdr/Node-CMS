import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
// const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));
const Branch = Loadable(lazy(() => import('pages/module/BranchPage')));
const Product = Loadable(lazy(() => import('pages/module/ProductPage')));
const Payment = Loadable(lazy(() => import('pages/module/PaymentPage')));
const GlobalSetting = Loadable(lazy(() => import('pages/module/GlobalSettingPage')));

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
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'icons/ant',
      element: <AntIcons />
    }
  ]
};

export default MainRoutes;
