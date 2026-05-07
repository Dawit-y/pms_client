import { Outlet } from 'react-router';

import { usePageFilters } from '../../hooks/usePageFilters';

const searchConfig = {
  textSearchKeys: ['name'],
};

export default function RolesLayout() {
  const pageFilter = usePageFilters(searchConfig);

  const outletContext = { pageFilter, searchConfig };

  return <Outlet context={outletContext} />;
}
