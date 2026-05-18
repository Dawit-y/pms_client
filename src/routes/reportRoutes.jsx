import { lazy } from 'react';

const Report = lazy(() => import('../pages/report'));

const reportRoutes = {
  path: '/reports',
  element: <Report />,
};

export default reportRoutes;
