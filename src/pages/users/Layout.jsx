import { Outlet } from 'react-router';

import { usePageFilters } from '../../hooks/usePageFilters';

const searchConfig = {
  textSearchKeys: ['name'],
  dateSearchKeys: ['created_at'],
};

export default function UsersLayout() {
  const pageFilter = usePageFilters(searchConfig);

  const outletContext = { pageFilter, searchConfig };

  return <Outlet context={outletContext} />;
}
