import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  getLocations,
  getLocation,
  addLocation,
  updateLocation,
  partialUpdateLocation,
  deleteLocation,
  getLocationTree,
  getLocationChildren,
  moveLocation,
  bulkDeleteLocations,
  bulkRestoreLocations,
  hardDeleteLocation,
  restoreLocation,
} from '../helpers/locations_helper';

const LOCATION_QUERY_KEY = ['location'];

// Helper function to categorize locations
const categorizeLocations = (locationsData) => {
  if (!locationsData?.data) {
    return {
      regions: [],
      zones: [],
      woredas: [],
      cities: [],
      allLocations: [],
      rawData: locationsData,
    };
  }

  const locations = locationsData.data;

  const categorized = {
    regions: [],
    zones: [],
    woredas: [],
    cities: [], // For future use if needed
    allLocations: locations,
  };

  locations.forEach((location) => {
    switch (location.location_type) {
      case 'region':
        categorized.regions.push(location);
        break;
      case 'zone':
        categorized.zones.push(location);
        break;
      case 'woreda':
        categorized.woredas.push(location);
        break;
      case 'city':
        categorized.cities.push(location);
        break;
      default:
        // Handle any other types
        break;
    }
  });

  return {
    ...categorized,
    rawData: locationsData,
    meta: locationsData.meta,
  };
};

// useFetchLocations with data selector
export const useFetchLocations = (param = {}, isActive = true) => {
  const queryResult = useQuery({
    queryKey: [...LOCATION_QUERY_KEY, 'fetch', param],
    queryFn: () => getLocations(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
    // Data selector to transform the response
    select: (response) => categorizeLocations(response),
  });

  return queryResult;
};

export const useFetchLocation = (uuid) => {
  return useQuery({
    queryKey: [...LOCATION_QUERY_KEY, 'fetch', uuid],
    queryFn: () => getLocation(uuid),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!uuid,
  });
};

export const useFetchLocationTree = (params = {}, isActive = true) => {
  return useQuery({
    queryKey: [...LOCATION_QUERY_KEY, 'tree', params],
    queryFn: () => getLocationTree(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

export const useFetchLocationChildren = (uuid, params = {}, enabled = true) => {
  return useQuery({
    queryKey: [...LOCATION_QUERY_KEY, 'children', uuid, params],
    queryFn: () => getLocationChildren(uuid, params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!uuid && enabled,
  });
};

export const useSearchLocations = (searchParams) => {
  return useQuery({
    queryKey: [...LOCATION_QUERY_KEY, 'search', searchParams],
    queryFn: () => getLocations(searchParams || {}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!searchParams && Object.keys(searchParams || {}).length > 0,
  });
};

// Mutation Hooks
export const useAddLocation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addLocation,
    meta: {
      successMessage: t('location_added_successfully'),
      errorMessage: t('location_add_failed'),
    },
    onMutate: async (newLocationPayload) => {
      await queryClient.cancelQueries({ queryKey: LOCATION_QUERY_KEY });
      await queryClient.cancelQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });

      const previousData = queryClient.getQueryData(LOCATION_QUERY_KEY);
      const previousTree = queryClient.getQueryData([
        ...LOCATION_QUERY_KEY,
        'tree',
      ]);

      // Optimistic update for list view
      queryClient.setQueryData(LOCATION_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: [
            {
              uuid: Date.now().toString(),
              ...newLocationPayload,
              isPending: true,
            },
            ...oldData.data,
          ],
        };
      });

      return { previousData, previousTree };
    },
    onError: (_err, _newLocation, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(LOCATION_QUERY_KEY, context.previousData);
      }
      if (context?.previousTree) {
        queryClient.setQueryData(
          [...LOCATION_QUERY_KEY, 'tree'],
          context.previousTree
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });
    },
  });
};

export const useUpdateLocation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLocation,
    meta: {
      successMessage: t('location_updated_successfully'),
      errorMessage: t('location_update_failed'),
    },
    onMutate: async (updatedLocation) => {
      await queryClient.cancelQueries({ queryKey: LOCATION_QUERY_KEY });
      await queryClient.cancelQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });

      const previousData = queryClient.getQueryData(LOCATION_QUERY_KEY);
      const previousTree = queryClient.getQueryData([
        ...LOCATION_QUERY_KEY,
        'tree',
      ]);

      // Optimistic update for list view
      queryClient.setQueryData(LOCATION_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((location) =>
            location.uuid === updatedLocation.uuid
              ? { ...location, ...updatedLocation }
              : location
          ),
        };
      });

      return { previousData, previousTree };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(LOCATION_QUERY_KEY, context.previousData);
      }
      if (context?.previousTree) {
        queryClient.setQueryData(
          [...LOCATION_QUERY_KEY, 'tree'],
          context.previousTree
        );
      }
    },
    onSettled: (_data, _error, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: LOCATION_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });
      queryClient.invalidateQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'children', uuid],
      });
    },
  });
};

export const usePartialUpdateLocation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }) => partialUpdateLocation(uuid, data),
    meta: {
      successMessage: t('location_updated_successfully'),
      errorMessage: t('location_update_failed'),
    },
    onMutate: async ({ uuid, data }) => {
      await queryClient.cancelQueries({ queryKey: LOCATION_QUERY_KEY });
      await queryClient.cancelQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });

      const previousData = queryClient.getQueryData(LOCATION_QUERY_KEY);
      const previousTree = queryClient.getQueryData([
        ...LOCATION_QUERY_KEY,
        'tree',
      ]);

      queryClient.setQueryData(LOCATION_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((location) =>
            location.uuid === uuid ? { ...location, ...data } : location
          ),
        };
      });

      return { previousData, previousTree };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(LOCATION_QUERY_KEY, context.previousData);
      }
      if (context?.previousTree) {
        queryClient.setQueryData(
          [...LOCATION_QUERY_KEY, 'tree'],
          context.previousTree
        );
      }
    },
    onSettled: (_data, _error, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: LOCATION_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });
      queryClient.invalidateQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'fetch', uuid],
      });
    },
  });
};

export const useDeleteLocation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLocation,
    meta: {
      successMessage: t('location_deleted_successfully'),
      errorMessage: t('location_delete_failed'),
    },
    onMutate: async (uuid) => {
      await queryClient.cancelQueries({ queryKey: LOCATION_QUERY_KEY });
      await queryClient.cancelQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });

      const previousData = queryClient.getQueryData(LOCATION_QUERY_KEY);
      const previousTree = queryClient.getQueryData([
        ...LOCATION_QUERY_KEY,
        'tree',
      ]);

      queryClient.setQueryData(LOCATION_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((location) => location.uuid !== uuid),
        };
      });

      return { previousData, previousTree };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(LOCATION_QUERY_KEY, context.previousData);
      }
      if (context?.previousTree) {
        queryClient.setQueryData(
          [...LOCATION_QUERY_KEY, 'tree'],
          context.previousTree
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });
    },
  });
};

export const useMoveLocation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, newParentUuid }) => moveLocation(uuid, newParentUuid),
    meta: {
      successMessage: t('location_moved_successfully'),
      errorMessage: t('location_move_failed'),
    },
    onMutate: async ({ uuid, newParentUuid }) => {
      await queryClient.cancelQueries({ queryKey: LOCATION_QUERY_KEY });
      await queryClient.cancelQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });

      const previousTree = queryClient.getQueryData([
        ...LOCATION_QUERY_KEY,
        'tree',
      ]);

      // Optimistically update the tree structure
      queryClient.setQueryData([...LOCATION_QUERY_KEY, 'tree'], (oldTree) => {
        if (!oldTree) return oldTree;

        // Recursive function to update parent in the tree
        const updateNodeParent = (nodes, targetUuid, newParentUuid) => {
          return nodes.map((node) => {
            if (node.uuid === targetUuid) {
              return { ...node, parent_uuid: newParentUuid };
            }
            if (node.children && node.children.length > 0) {
              return {
                ...node,
                children: updateNodeParent(
                  node.children,
                  targetUuid,
                  newParentUuid
                ),
              };
            }
            return node;
          });
        };

        return updateNodeParent(oldTree, uuid, newParentUuid);
      });

      return { previousTree };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTree) {
        queryClient.setQueryData(
          [...LOCATION_QUERY_KEY, 'tree'],
          context.previousTree
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });
      queryClient.invalidateQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'children'],
      });
    },
  });
};

export const useBulkDeleteLocations = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteLocations,
    meta: {
      successMessage: t('locations_bulk_deleted_successfully'),
      errorMessage: t('locations_bulk_delete_failed'),
    },
    onMutate: async (uuids) => {
      await queryClient.cancelQueries({ queryKey: LOCATION_QUERY_KEY });
      await queryClient.cancelQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });

      const previousData = queryClient.getQueryData(LOCATION_QUERY_KEY);
      const previousTree = queryClient.getQueryData([
        ...LOCATION_QUERY_KEY,
        'tree',
      ]);

      queryClient.setQueryData(LOCATION_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter(
            (location) => !uuids.includes(location.uuid)
          ),
        };
      });

      return { previousData, previousTree };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(LOCATION_QUERY_KEY, context.previousData);
      }
      if (context?.previousTree) {
        queryClient.setQueryData(
          [...LOCATION_QUERY_KEY, 'tree'],
          context.previousTree
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });
    },
  });
};

export const useBulkRestoreLocations = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkRestoreLocations,
    meta: {
      successMessage: t('locations_bulk_restored_successfully'),
      errorMessage: t('locations_bulk_restore_failed'),
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });
    },
  });
};

export const useHardDeleteLocation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hardDeleteLocation,
    meta: {
      successMessage: t('location_permanently_deleted'),
      errorMessage: t('location_hard_delete_failed'),
    },
    onMutate: async (uuid) => {
      await queryClient.cancelQueries({ queryKey: LOCATION_QUERY_KEY });
      await queryClient.cancelQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });

      const previousData = queryClient.getQueryData(LOCATION_QUERY_KEY);
      const previousTree = queryClient.getQueryData([
        ...LOCATION_QUERY_KEY,
        'tree',
      ]);

      queryClient.setQueryData(LOCATION_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((location) => location.uuid !== uuid),
        };
      });

      return { previousData, previousTree };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(LOCATION_QUERY_KEY, context.previousData);
      }
      if (context?.previousTree) {
        queryClient.setQueryData(
          [...LOCATION_QUERY_KEY, 'tree'],
          context.previousTree
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });
    },
  });
};

export const useRestoreLocation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreLocation,
    meta: {
      successMessage: t('location_restored_successfully'),
      errorMessage: t('location_restore_failed'),
    },
    onSettled: (_, __, uuid) => {
      queryClient.invalidateQueries({ queryKey: LOCATION_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'tree'],
      });
      queryClient.invalidateQueries({
        queryKey: [...LOCATION_QUERY_KEY, 'fetch', uuid],
      });
    },
  });
};
