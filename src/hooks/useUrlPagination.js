import { useMemo, useCallback } from 'react';

export function useUrlPagination(filters, setFilters) {
  const pagination = useMemo(
    () => ({
      pageIndex: (filters.page ?? 1) - 1,
      pageSize: filters.pageSize ?? 10,
    }),
    [filters.page, filters.pageSize]
  );

  const onChange = useCallback(
    (p) => {
      // setFilters here is updateFilters wrapper that handles merging internally
      setFilters(
        {
          page: p.pageIndex + 1,
          pageSize: p.pageSize,
        },
        { shallow: false }
      );
    },
    [setFilters]
  );

  return { pagination, onChange };
}
