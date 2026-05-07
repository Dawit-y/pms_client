import { lazy } from 'react';

import lookupRoutes from './lookupRoutes';
import lookTypeRoutes from './lookupTypeRoutes';
import userRoutes from './userRoutes';

const Login = lazy(() => import('../pages/auth/Login'));
const Dashboard = lazy(() => import('../pages/dashboard'));

export const protectedRoutes = [
  lookTypeRoutes,
  lookupRoutes,
  userRoutes,
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/',
    element: <Dashboard />,
  },
];

export const publicRoutes = [{ path: '/login', element: <Login /> }];
