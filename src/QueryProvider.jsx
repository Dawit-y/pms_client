import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { toast } from 'react-toastify';

import i18n from './i18n';

const getErrorMessage = (error) => {
  const t = i18n.t.bind(i18n);
  const statusMessages = {
    400: t('errors_badRequest'),
    401: t('errors_unauthorized'),
    403: t('errors_forbidden'),
    404: t('errors_notFound'),
    452: t('errors_duplicateEntry'),
    453: t('errors_missingField'),
    454: t('errors_invalidReference'),
    455: t('errors_genericError'),
    456: t('errors_valueTooLong'),
    457: t('errors_updateIdNotProvided'),
    458: t('errors_dataNotFoundWithId'),
    459: t('errors_notAllowedSave'),
    460: t('errors_notAllowedUpdate'),
    461: t('errors_notAllowedViewList'),
    429: t('errors_tooManyRequests'),
    487: t('errors_incorrect_input'),
    500: t('errors_serverError'),
  };

  if (error?.response?.data) {
    const { status_code, errorMsg, column } = error.response.data;

    if (errorMsg) {
      return `${errorMsg} ${column ? `on ${column}` : ''}`;
    }

    if (statusMessages[status_code]) {
      return `${statusMessages[status_code]} ${column ? `on ${column}` : ''}`;
    }
  }

  return null;
};

// Create a Web Storage Persistor
const localStoragePersistor = createAsyncStoragePersister({
  storage: window.localStorage,
});

// Create the QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 10,
    },
  },
  queryCache: new QueryCache({}),
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      if (mutation.options.meta?.successMessage) {
        toast.success(mutation.options.meta.successMessage, {
          autoClose: 2000,
        });
      }
    },
    onError: (error, _variables, _context, mutation) => {
      if (mutation.options.meta?.skipGlobalErrorHandler) {
        return;
      }

      const specificMessage = getErrorMessage(error);
      if (specificMessage) {
        toast.error(specificMessage, { autoClose: 2000 });
        return;
      }

      if (mutation.options.meta?.errorMessage) {
        toast.error(mutation.options.meta.errorMessage, { autoClose: 2000 });
        return;
      }

      toast.error(error.message || 'Operation failed', { autoClose: 2000 });
    },
  }),
});

const QueryProvider = ({ children }) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersistor,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.meta?.persist === true,
        },
      }}
    >
      {children}
      {import.meta.env.VITE_NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </PersistQueryClientProvider>
  );
};

export default QueryProvider;
