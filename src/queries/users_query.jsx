import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  getUsers,
  getUser,
  addUser,
  updateUser,
  partialUpdateUser,
  deleteUser,
  bulkDeleteUsers,
  bulkRestoreUsers,
  getUserStats,
  activateUser,
  deactivateUser,
  getUserActivity,
  assignGroupsToUser,
  hardDeleteUser,
  restoreUser,
  setUserPassword,
} from '../helpers/users_helper';

const USER_QUERY_KEY = ['user'];

// Query Hooks
export const useFetchUsers = (param = {}, isActive = true) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEY, 'fetch', param],
    queryFn: () => getUsers(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

export const useFetchUser = (uuid) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEY, 'fetch', uuid],
    queryFn: () => getUser(uuid),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!uuid,
  });
};

export const useSearchUsers = (searchParams) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEY, 'search', searchParams],
    queryFn: () => getUsers(searchParams || {}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!searchParams && Object.keys(searchParams || {}).length > 0,
  });
};

export const useFetchUserStats = () => {
  return useQuery({
    queryKey: [...USER_QUERY_KEY, 'stats'],
    queryFn: () => getUserStats(),
    staleTime: 1000 * 60 * 2, // Shorter stale time for stats
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

export const useFetchUserActivity = (uuid, params = {}, enabled = true) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEY, 'activity', uuid, params],
    queryFn: () => getUserActivity(uuid, params),
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!uuid && enabled,
  });
};

// Mutation Hooks
export const useAddUser = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUser,
    meta: {
      successMessage: t('added_successfully'),
      errorMessage: t('add_failed'),
    },
    onMutate: async (newUserPayload) => {
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY });

      const previousData = queryClient.getQueryData(USER_QUERY_KEY);

      queryClient.setQueryData(USER_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: [
            {
              uuid: Date.now().toString(),
              ...newUserPayload,
              isPending: true,
            },
            ...oldData.data,
          ],
        };
      });

      return { previousData };
    },
    onError: (_err, _newUser, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(USER_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY, 'stats'] });
    },
  });
};

export const useUpdateUser = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    meta: {
      successMessage: t('updated_successfully'),
      errorMessage: t('update_failed'),
    },
    onMutate: async (updatedUser) => {
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY });

      const previousData = queryClient.getQueryData(USER_QUERY_KEY);

      queryClient.setQueryData(USER_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((user) =>
            user.uuid === updatedUser.uuid ? { ...user, ...updatedUser } : user
          ),
        };
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(USER_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
};

export const usePartialUpdateUser = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }) => partialUpdateUser(uuid, data),
    meta: {
      successMessage: t('updated_successfully'),
      errorMessage: t('update_failed'),
    },
    onMutate: async ({ uuid, data }) => {
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY });

      const previousData = queryClient.getQueryData(USER_QUERY_KEY);

      queryClient.setQueryData(USER_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((user) =>
            user.uuid === uuid ? { ...user, ...data } : user
          ),
        };
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(USER_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
};

export const useDeleteUser = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    meta: {
      successMessage: t('deleted_successfully'),
      errorMessage: t('delete_failed'),
    },
    onMutate: async (uuid) => {
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY });

      const previousData = queryClient.getQueryData(USER_QUERY_KEY);

      queryClient.setQueryData(USER_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((user) => user.uuid !== uuid),
        };
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(USER_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY, 'stats'] });
    },
  });
};

export const useBulkDeleteUsers = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteUsers,
    meta: {
      successMessage: t('bulk_deleted_successfully'),
      errorMessage: t('bulk_delete_failed'),
    },
    onMutate: async (uuids) => {
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY });

      const previousData = queryClient.getQueryData(USER_QUERY_KEY);

      queryClient.setQueryData(USER_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((user) => !uuids.includes(user.uuid)),
        };
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(USER_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY, 'stats'] });
    },
  });
};

export const useBulkRestoreUsers = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkRestoreUsers,
    meta: {
      successMessage: t('bulk_restored_successfully'),
      errorMessage: t('bulk_restore_failed'),
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY, 'stats'] });
    },
  });
};

export const useActivateUser = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateUser,
    meta: {
      successMessage: t('user_activated_successfully'),
      errorMessage: t('user_activation_failed'),
    },
    onSettled: (_, __, uuid) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...USER_QUERY_KEY, 'fetch', uuid],
      });
      queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY, 'stats'] });
    },
  });
};

export const useDeactivateUser = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateUser,
    meta: {
      successMessage: t('user_deactivated_successfully'),
      errorMessage: t('user_deactivation_failed'),
    },
    onSettled: (_, __, uuid) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...USER_QUERY_KEY, 'fetch', uuid],
      });
      queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY, 'stats'] });
    },
  });
};

export const useAssignGroupsToUser = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, groupIds }) => assignGroupsToUser(uuid, groupIds),
    meta: {
      successMessage: t('groups_assigned_successfully'),
      errorMessage: t('groups_assignment_failed'),
    },
    onSettled: (_, __, { uuid }) => {
      queryClient.invalidateQueries({
        queryKey: [...USER_QUERY_KEY, 'fetch', uuid],
      });
    },
  });
};

export const useHardDeleteUser = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hardDeleteUser,
    meta: {
      successMessage: t('user_permanently_deleted'),
      errorMessage: t('hard_delete_failed'),
    },
    onMutate: async (uuid) => {
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY });

      const previousData = queryClient.getQueryData(USER_QUERY_KEY);

      queryClient.setQueryData(USER_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((user) => user.uuid !== uuid),
        };
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(USER_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY, 'stats'] });
    },
  });
};

export const useRestoreUser = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreUser,
    meta: {
      successMessage: t('user_restored_successfully'),
      errorMessage: t('user_restore_failed'),
    },
    onSettled: (_, __, uuid) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...USER_QUERY_KEY, 'fetch', uuid],
      });
      queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY, 'stats'] });
    },
  });
};

export const useSetUserPassword = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ uuid, passwordData }) => setUserPassword(uuid, passwordData),
    meta: {
      successMessage: t('password_set_successfully'),
      errorMessage: t('password_set_failed'),
    },
  });
};
