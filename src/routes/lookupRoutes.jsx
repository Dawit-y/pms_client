import { lazy } from 'react';

const Lookups = lazy(() => import('../pages/lookups'));
const AddLookup = lazy(() => import('../pages/lookups/AddLookup'));
const LookupDetails = lazy(() => import('../pages/lookups/Detail'));
const EditLookup = lazy(() => import('../pages/lookups/EditLookup'));
const LookupsLayout = lazy(() => import('../pages/lookups/Layout'));

const lookupRoutes = {
  path: '/lookups',
  element: <LookupsLayout />,
  permission: 'lookups.view_lookup',
  children: [
    {
      index: true,
      element: <Lookups />,
    },
    {
      path: 'type/:typeId',
      element: <Lookups />,
    },
    {
      path: 'type/:typeId/add',
      element: <AddLookup />,
      permission: 'lookups.add_lookup',
    },
    {
      path: 'type/:typeId/:id',
      element: <LookupDetails />,
    },
    {
      path: 'type/:typeId/:id/edit',
      element: <EditLookup />,
      permission: 'lookups.change_lookup',
    },
  ],
};

export default lookupRoutes;
