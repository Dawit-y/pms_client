import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { get, post } from '../helpers/axios';

const fetchNotifications = async () => {
  return await get('notifications/');
};

const fetchUnreadCount = async () => {
  return await get('notifications/unread-count/');
};

const markOneAsRead = async (uuid) => {
  return await post(`notifications/${uuid}/read/`);
};

const markAllAsRead = async () => {
  return await post('notifications/read-all/');
};

export const useFetchNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: fetchUnreadCount,
    staleTime: 60 * 1000,
    retry: 1,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markOneAsRead,
    onSuccess: (_, uuid) => {
      queryClient.setQueryData(['notifications'], (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((n) =>
            n.uuid === uuid ? { ...n, is_read: true } : n
          ),
        };
      });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count'],
      });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData(['notifications'], (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((n) => ({ ...n, is_read: true })),
        };
      });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count'],
      });
    },
  });
};
