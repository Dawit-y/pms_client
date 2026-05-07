import { useQuery } from '@tanstack/react-query';

import {
  getPermissions,
  getPermission,
  getPermissionsByApp,
} from '../helpers/permissions_helper';

const PERMISSION_QUERY_KEY = ['permission'];

// Query Hooks
export const useFetchPermissions = (params = {}, isActive = true) => {
  return useQuery({
    queryKey: [...PERMISSION_QUERY_KEY, 'fetch', params],
    queryFn: () => getPermissions(params),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

export const useFetchPermission = (id) => {
  return useQuery({
    queryKey: [...PERMISSION_QUERY_KEY, 'fetch', id],
    queryFn: () => getPermission(id),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!id,
  });
};

export const useFetchPermissionsByApp = (params = {}, isActive = true) => {
  return useQuery({
    queryKey: [...PERMISSION_QUERY_KEY, 'byApp', params],
    queryFn: () => getPermissionsByApp(params),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

export const useSearchPermissions = (searchParams) => {
  return useQuery({
    queryKey: [...PERMISSION_QUERY_KEY, 'search', searchParams],
    queryFn: () => getPermissions(searchParams || {}),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!searchParams && Object.keys(searchParams || {}).length > 0,
  });
};
