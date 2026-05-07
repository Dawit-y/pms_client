import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  getLookupTypes,
  getLookupType,
  addLookupType,
  updateLookupType,
  deleteLookupType,
} from '../helpers/lookup_types_helper';

const LOOKUP_TYPE_QUERY_KEY = ['lookup_type'];

export const useFetchLookupTypes = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...LOOKUP_TYPE_QUERY_KEY, 'fetch', param],
    queryFn: () => getLookupTypes(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

export const useFetchLookupType = (id) => {
  return useQuery({
    queryKey: [...LOOKUP_TYPE_QUERY_KEY, 'fetch', id],
    queryFn: () => getLookupType(id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!id,
  });
};

export const useSearchLookupTypes = (searchParams) => {
  return useQuery({
    queryKey: [...LOOKUP_TYPE_QUERY_KEY, 'search', searchParams],
    queryFn: () => getLookupTypes(searchParams || {}),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 6,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!searchParams && Object.keys(searchParams || {}).length > 0,
    placeholderData: keepPreviousData,
  });
};

export const useAddLookupType = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addLookupType,
    meta: {
      successMessage: t('added_successfully'),
      errorMessage: t('add_failed'),
    },
    onMutate: async (newLookupTypePayload) => {
      await queryClient.cancelQueries({ queryKey: LOOKUP_TYPE_QUERY_KEY });

      const previousData = queryClient.getQueryData(LOOKUP_TYPE_QUERY_KEY);

      queryClient.setQueryData(LOOKUP_TYPE_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: [
            {
              uuid: Date.now(),
              ...newLookupTypePayload,
              isPending: true,
            },
            ...oldData.data,
          ],
        };
      });

      return { previousData };
    },

    onError: (_err, _newLookupType, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(LOOKUP_TYPE_QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LOOKUP_TYPE_QUERY_KEY });
    },
  });
};

export const useUpdateLookupType = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLookupType,
    meta: {
      successMessage: t('updated_successfully'),
      errorMessage: t('update_failed'),
    },

    onMutate: async (updatedLookupType) => {
      await queryClient.cancelQueries({ queryKey: LOOKUP_TYPE_QUERY_KEY });

      const previousData = queryClient.getQueryData(LOOKUP_TYPE_QUERY_KEY);

      queryClient.setQueryData(LOOKUP_TYPE_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((lookup_type) =>
            lookup_type.uuid === updatedLookupType.uuid
              ? { ...lookup_type, ...updatedLookupType }
              : lookup_type
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(LOOKUP_TYPE_QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LOOKUP_TYPE_QUERY_KEY });
    },
  });
};

export const useDeleteLookupType = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLookupType,

    meta: {
      successMessage: t('deleted_successfully'),
      errorMessage: t('delete_failed'),
    },

    onMutate: async (lookup_typeId) => {
      await queryClient.cancelQueries({ queryKey: LOOKUP_TYPE_QUERY_KEY });

      const previousQueries = queryClient.getQueriesData({
        queryKey: LOOKUP_TYPE_QUERY_KEY,
      });

      previousQueries.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, (oldData) => {
          const dataArray = oldData?.data || oldData?.results;
          if (!dataArray) return oldData;

          const newDataArray = dataArray.filter(
            (lookup_type) => lookup_type.uuid !== parseInt(lookup_typeId)
          );

          return {
            ...oldData,
            [oldData?.data ? 'data' : 'results']: newDataArray,
          };
        });
      });

      return { previousQueries };
    },

    onError: (_err, _vars, context) => {
      context?.previousQueries?.forEach(([queryKey, oldData]) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LOOKUP_TYPE_QUERY_KEY });
    },
  });
};
