import { lazy } from 'react';

const Users = lazy(() => import('../pages/users'));
const AddUser = lazy(() => import('../pages/users/AddUser'));
const UserDetails = lazy(() => import('../pages/users/Detail'));
const EditUser = lazy(() => import('../pages/users/EditUser'));
const UsersLayout = lazy(() => import('../pages/users/Layout'));

const userRoutes = {
  path: '/users',
  element: <UsersLayout />,
  permission: 'accounts.view_user',
  children: [
    { index: true, element: <Users /> },
    {
      path: 'add',
      element: <AddUser />,
      permission: 'accounts.add_user',
    },
    { path: ':id/:tab?', element: <UserDetails /> },
    {
      path: ':id/edit',
      element: <EditUser />,
      permission: 'accounts.change_user',
    },
  ],
};

export default userRoutes;
