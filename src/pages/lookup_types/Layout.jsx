import { Outlet } from 'react-router';

import { usePageFilters } from '../../hooks/usePageFilters';

const searchConfig = {
  textSearchKeys: ['lkt_type_name', 'lkt_type_code'],
};

export default function LookupTypesLayout() {
  const pageFilter = usePageFilters(searchConfig);

  const outletContext = { pageFilter, searchConfig };

  return <Outlet context={outletContext} />;
}
