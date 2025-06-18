import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const ForgotPassword = Loadable(lazy(() => import('pages/authentication/ForgotPassword')));
const ResetPassword = Loadable(lazy(() => import('pages/authentication/ResetPassword')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin />
    },
     {
      path: 'forgot-password',
      element: <ForgotPassword />
    },
    {
      path: 'reset-password/:token',
      element: <ResetPassword />
    }
  ]
};

export default LoginRoutes;
