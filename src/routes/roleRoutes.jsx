import { lazy } from 'react';

const Roles = lazy(() => import('../pages/roles'));
const AddRole = lazy(() => import('../pages/roles/AddRole'));
const EditRole = lazy(() => import('../pages/roles/EditRole'));
const RolesLayout = lazy(() => import('../pages/roles/Layout'));

const roleRoutes = {
  path: '/roles',
  element: <RolesLayout />,
  permission: 'auth.view_group',
  children: [
    { index: true, element: <Roles /> },
    {
      path: 'add',
      element: <AddRole />,
      permission: 'auth.add_group',
    },
    {
      path: ':id/edit',
      element: <EditRole />,
      permission: 'auth.change_group',
    },
  ],
};

export default roleRoutes;
