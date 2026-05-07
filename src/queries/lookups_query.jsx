import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getLookups,
  getLookup,
  addLookup,
  updateLookup,
  deleteLookup,
} from '../helpers/lookups_helper';

const LOOKUP_QUERY_KEY = ['lookup'];

/**
 * Creates a key-value map from lookup data with language-aware labels
 * @param {Array} lookups - Array of lookup objects
 * @param {string} lang - Current language code ('en', 'am', 'or')
 * @param {Object} options - Additional options
 * @param {Function} options.filterFn - Optional filter function
 * @param {string} options.valueField - Which field to use as value (default: 'lku_id')
 * @returns {Object} Key-value map with localized labels
 */
export const createLookupMap = (lookups, lang = 'en', options = {}) => {
  const { filterFn = () => true, valueField = 'lku_id' } = options;

  if (!Array.isArray(lookups)) {
    console.warn('createLookupMap: lookups must be an array');
    return {};
  }

  // Map language to the corresponding field name
  const langFieldMap = {
    en: 'lku_name_en',
    am: 'lku_name_am',
    or: 'lku_name_or',
  };

  const labelField = langFieldMap[lang] || langFieldMap.en;

  return lookups.reduce((acc, lookup) => {
    if (filterFn(lookup)) {
      acc[lookup[valueField]] =
        lookup[labelField] ||
        lookup.lku_name_en ||
        `Item ${lookup[valueField]}`;
    }
    return acc;
  }, {});
};

/**
 * Creates multiple lookup maps at once
 * @param {Object} lookupsByType - Object with type IDs as keys and arrays of lookups as values
 * @param {string} lang - Current language code
 * @returns {Object} Object with type IDs as keys and their corresponding maps
 */
export const createLookupMapsByType = (lookupsByType, lang = 'en') => {
  const maps = {};

  Object.entries(lookupsByType).forEach(([typeId, lookups]) => {
    maps[typeId] = createLookupMap(lookups, lang);
  });

  return maps;
};

/**
 * Groups lookups by their type ID
 * @param {Array} lookups - Array of lookup objects
 * @returns {Object} Lookups grouped by lku_type_id
 */
export const groupLookupsByType = (lookups) => {
  return lookups.reduce((acc, lookup) => {
    const typeId = lookup.lku_type_id;
    if (!acc[typeId]) {
      acc[typeId] = [];
    }
    acc[typeId].push(lookup);
    return acc;
  }, {});
};

/**
 * Sorts lookups by order_id for consistent display
 * @param {Array} lookups - Array of lookup objects
 * @returns {Array} Sorted lookups
 */
export const sortLookupsByOrder = (lookups) => {
  return [...lookups].sort((a, b) => {
    const orderA = a.lku_order_id || 999;
    const orderB = b.lku_order_id || 999;
    return orderA - orderB;
  });
};

/**
 * Fetch lookups by type IDs
 * @param {Array|number} typeIds - Single type ID or array of type IDs
 */
export const useFetchLookupsByTypes = (typeIds, options = {}) => {
  const { enabled = true, ...restOptions } = options;

  const typeIdsArray = Array.isArray(typeIds)
    ? typeIds
    : [typeIds].filter(Boolean);
  const typeParam =
    typeIdsArray.length > 0 ? typeIdsArray.join(',') : undefined;

  return useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, 'byTypes', typeParam],
    queryFn: () => getLookups({ type: typeParam }),
    staleTime: 1000 * 60 * 50,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: enabled && typeIdsArray.length > 0,
    ...restOptions,
  });
};

/**
 * Hook to get lookups as maps keyed by type ID
 * This is the main hook you'll use in components
 */
export const useLookups = (typeIds, options = {}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const { data, isLoading, isError, error } = useFetchLookupsByTypes(
    typeIds,
    options
  );

  // Transform data into an object with type IDs as keys and maps as values
  const lookupsByType = useMemo(() => {
    if (!data?.results) return {};

    // Group lookups by their type ID
    const grouped = groupLookupsByType(data.results);

    // Create a map for each type
    const result = {};
    Object.entries(grouped).forEach(([typeId, lookups]) => {
      result[typeId] = createLookupMap(lookups, currentLang);
    });

    return result;
  }, [data, currentLang]);

  // Memoized helper function to get lookup label
  const getLookupLabel = useCallback(
    (typeId, value) => {
      if (!value) return '—';
      const map = lookupsByType[typeId] || {};
      return map[value] || value;
    },
    [lookupsByType]
  );

  return {
    lookupsByType, // { [typeId]: { [lookupId]: label } }
    getLookupLabel, // Helper function to get label for a specific lookup
    isLoading,
    isError,
    error,
    rawData: data?.results || [],
  };
};

/**
 * Convenience hook to get a single lookup type as a map
 */
export const useLookup = (typeId, options = {}) => {
  const { lookupsByType, isLoading, isError } = useLookups(typeId, options);

  return {
    map: lookupsByType[typeId] || {},
    isLoading,
    isError,
  };
};

export const useFetchLookups = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, 'fetch', param],
    queryFn: () => getLookups(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

export const useFetchLookup = (id) => {
  return useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, 'fetch', id],
    queryFn: () => getLookup(id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!id,
  });
};

export const useSearchLookups = (searchParams) => {
  return useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, 'search', searchParams],
    queryFn: () => getLookups(searchParams || {}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!searchParams && Object.keys(searchParams || {}).length > 0,
  });
};

export const useAddLookup = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addLookup,
    meta: {
      successMessage: t('added_successfully'),
      errorMessage: t('add_failed'),
    },
    onMutate: async (newLookupPayload) => {
      await queryClient.cancelQueries({ queryKey: LOOKUP_QUERY_KEY });

      const previousData = queryClient.getQueryData(LOOKUP_QUERY_KEY);

      queryClient.setQueryData(LOOKUP_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: [
            {
              lku_id: Date.now(),
              ...newLookupPayload,
              isPending: true,
            },
            ...oldData.data,
          ],
        };
      });

      return { previousData };
    },

    onError: (_err, _newLookup, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(LOOKUP_QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LOOKUP_QUERY_KEY });
    },
  });
};

export const useUpdateLookup = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLookup,
    meta: {
      successMessage: t('updated_successfully'),
      errorMessage: t('update_failed'),
    },

    onMutate: async (updatedLookup) => {
      await queryClient.cancelQueries({ queryKey: LOOKUP_QUERY_KEY });

      const previousData = queryClient.getQueryData(LOOKUP_QUERY_KEY);

      queryClient.setQueryData(LOOKUP_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((lookup) =>
            lookup.lku_id === updatedLookup.lku_id
              ? { ...lookup, ...updatedLookup }
              : lookup
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(LOOKUP_QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LOOKUP_QUERY_KEY });
    },
  });
};

export const useDeleteLookup = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLookup,

    meta: {
      successMessage: t('deleted_successfully'),
      errorMessage: t('delete_failed'),
    },

    onMutate: async (lookupId) => {
      await queryClient.cancelQueries({ queryKey: LOOKUP_QUERY_KEY });

      const previousData = queryClient.getQueryData(LOOKUP_QUERY_KEY);

      queryClient.setQueryData(LOOKUP_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter(
            (lookup) => lookup.lku_id !== parseInt(lookupId)
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(LOOKUP_QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LOOKUP_QUERY_KEY });
    },
  });
};
