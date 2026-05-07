import { lazy } from 'react';

const LookupTypes = lazy(() => import('../pages/lookup_types'));
const AddLookupType = lazy(() => import('../pages/lookup_types/AddLookupType'));
const LookupTypeDetails = lazy(() => import('../pages/lookup_types/Detail'));
const EditLookupType = lazy(
  () => import('../pages/lookup_types/EditLookupType')
);
const LookupTypesLayout = lazy(() => import('../pages/lookup_types/Layout'));

const lookup_typeRoutes = {
  path: '/lookup_types',
  element: <LookupTypesLayout />,
  // permission: 'lookuptype.view_lookuptype',
  children: [
    { index: true, element: <LookupTypes /> },
    {
      path: 'add',
      element: <AddLookupType />,
      permission: 'lookuptype.add_lookuptype',
    },
    { path: ':id/:tab?', element: <LookupTypeDetails /> },
    {
      path: ':id/edit',
      element: <EditLookupType />,
      permission: 'lookuptype.edit_lookuptype',
    },
  ],
};

export default lookup_typeRoutes;
