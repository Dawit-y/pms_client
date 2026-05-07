import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  getRoles,
  getRole,
  addRole,
  updateRole,
  partialUpdateRole,
  deleteRole,
  addPermissionsToRole,
  removePermissionsFromRole,
  getRoleUsers,
} from '../helpers/roles_helper';

const ROLE_QUERY_KEY = ['role'];

// Helper function to transform API response if needed
const transformRoleData = (response) => {
  if (!response?.data) return response;

  return {
    ...response,
    data: response.data.map((role) => ({
      ...role,
      // Add any computed fields here if needed
      isSystemRole: role.name?.startsWith('system_') || false,
      userCount: role.users?.length || 0,
      permissionCount: role.permissions?.length || 0,
    })),
  };
};

// Query Hooks
export const useFetchRoles = (params = {}, isActive = true) => {
  return useQuery({
    queryKey: [...ROLE_QUERY_KEY, 'fetch', params],
    queryFn: () => getRoles(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
    select: transformRoleData,
  });
};

export const useFetchRole = (id) => {
  return useQuery({
    queryKey: [...ROLE_QUERY_KEY, 'fetch', id],
    queryFn: () => getRole(id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!id,
    select: (response) => {
      if (!response?.data) return response;
      return {
        ...response,
        data: {
          ...response.data,
          isSystemRole: response.data.name?.startsWith('system_') || false,
          userCount: response.data.users?.length || 0,
          permissionCount: response.data.permissions?.length || 0,
        },
      };
    },
  });
};

export const useFetchRoleUsers = (id, params = {}, enabled = true) => {
  return useQuery({
    queryKey: [...ROLE_QUERY_KEY, 'users', id, params],
    queryFn: () => getRoleUsers(id, params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!id && enabled,
  });
};

export const useSearchRoles = (searchParams) => {
  return useQuery({
    queryKey: [...ROLE_QUERY_KEY, 'search', searchParams],
    queryFn: () => getRoles(searchParams || {}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!searchParams && Object.keys(searchParams || {}).length > 0,
    select: transformRoleData,
  });
};

// Mutation Hooks
export const useAddRole = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRole,
    meta: {
      successMessage: t('role_added_successfully'),
      errorMessage: t('role_add_failed'),
    },
    onMutate: async (newRolePayload) => {
      await queryClient.cancelQueries({ queryKey: ROLE_QUERY_KEY });

      const previousData = queryClient.getQueryData(ROLE_QUERY_KEY);

      queryClient.setQueryData(ROLE_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: [
            {
              id: Date.now(),
              ...newRolePayload,
              isPending: true,
              userCount: 0,
              permissionCount: 0,
            },
            ...oldData.data,
          ],
        };
      });

      return { previousData };
    },
    onError: (_err, _newRole, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(ROLE_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEY });
    },
  });
};

export const useUpdateRole = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRole,
    meta: {
      successMessage: t('role_updated_successfully'),
      errorMessage: t('role_update_failed'),
    },
    onMutate: async (updatedRole) => {
      await queryClient.cancelQueries({ queryKey: ROLE_QUERY_KEY });

      const previousData = queryClient.getQueryData(ROLE_QUERY_KEY);

      queryClient.setQueryData(ROLE_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((role) =>
            role.id === updatedRole.id ? { ...role, ...updatedRole } : role
          ),
        };
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(ROLE_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEY });
    },
  });
};

export const usePartialUpdateRole = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => partialUpdateRole(id, data),
    meta: {
      successMessage: t('role_updated_successfully'),
      errorMessage: t('role_update_failed'),
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ROLE_QUERY_KEY });

      const previousData = queryClient.getQueryData(ROLE_QUERY_KEY);

      queryClient.setQueryData(ROLE_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((role) =>
            role.id === id ? { ...role, ...data } : role
          ),
        };
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(ROLE_QUERY_KEY, context.previousData);
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ROLE_QUERY_KEY, 'fetch', id],
      });
    },
  });
};

export const useDeleteRole = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRole,
    meta: {
      successMessage: t('role_deleted_successfully'),
      errorMessage: t('role_delete_failed'),
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ROLE_QUERY_KEY });

      const previousData = queryClient.getQueryData(ROLE_QUERY_KEY);

      queryClient.setQueryData(ROLE_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((role) => role.id !== id),
        };
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(ROLE_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEY });
    },
  });
};

// Permission Management Hooks
export const useAddPermissionsToRole = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissionIds }) =>
      addPermissionsToRole(id, permissionIds),
    meta: {
      successMessage: t('permissions_added_successfully'),
      errorMessage: t('permissions_add_failed'),
    },
    onMutate: async ({ id, permissionIds }) => {
      await queryClient.cancelQueries({ queryKey: ROLE_QUERY_KEY });
      await queryClient.cancelQueries({
        queryKey: [...ROLE_QUERY_KEY, 'fetch', id],
      });

      const previousRole = queryClient.getQueryData([
        ...ROLE_QUERY_KEY,
        'fetch',
        id,
      ]);

      // Optimistically update the role with new permissions
      queryClient.setQueryData([...ROLE_QUERY_KEY, 'fetch', id], (oldData) => {
        if (!oldData?.data) return oldData;

        const existingPermissions = oldData.data.permissions || [];
        const newPermissions = permissionIds.map((pid) => ({
          id: pid,
          isPending: true,
        }));

        return {
          ...oldData,
          data: {
            ...oldData.data,
            permissions: [...existingPermissions, ...newPermissions],
            permissionCount: existingPermissions.length + permissionIds.length,
          },
        };
      });

      return { previousRole };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousRole) {
        queryClient.setQueryData(
          [...ROLE_QUERY_KEY, 'fetch', context.previousRole.data.id],
          context.previousRole
        );
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ROLE_QUERY_KEY, 'fetch', id],
      });
    },
  });
};

export const useRemovePermissionsFromRole = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissionIds }) =>
      removePermissionsFromRole(id, permissionIds),
    meta: {
      successMessage: t('permissions_removed_successfully'),
      errorMessage: t('permissions_remove_failed'),
    },
    onMutate: async ({ id, permissionIds }) => {
      await queryClient.cancelQueries({ queryKey: ROLE_QUERY_KEY });
      await queryClient.cancelQueries({
        queryKey: [...ROLE_QUERY_KEY, 'fetch', id],
      });

      const previousRole = queryClient.getQueryData([
        ...ROLE_QUERY_KEY,
        'fetch',
        id,
      ]);

      // Optimistically remove permissions
      queryClient.setQueryData([...ROLE_QUERY_KEY, 'fetch', id], (oldData) => {
        if (!oldData?.data) return oldData;

        const updatedPermissions = (oldData.data.permissions || []).filter(
          (permission) => !permissionIds.includes(permission.id)
        );

        return {
          ...oldData,
          data: {
            ...oldData.data,
            permissions: updatedPermissions,
            permissionCount: updatedPermissions.length,
          },
        };
      });

      return { previousRole };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousRole) {
        queryClient.setQueryData(
          [...ROLE_QUERY_KEY, 'fetch', context.previousRole.data.id],
          context.previousRole
        );
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ROLE_QUERY_KEY, 'fetch', id],
      });
    },
  });
};
