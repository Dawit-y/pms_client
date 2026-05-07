import { useQuery } from '@tanstack/react-query';

import {
  getLetterReports,
  getLetterReport,
} from '../helpers/letter_report_helper';

const LETTER_REPORT_QUERY_KEY = ['letter_reports'];

export const useFetchLetterReports = (param = {}, isActive) => {
  return useQuery({
    queryKey: [...LETTER_REPORT_QUERY_KEY, 'fetch', param],
    queryFn: () => getLetterReports(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isActive,
  });
};

export const useFetchLetterReport = (id) => {
  return useQuery({
    queryKey: [...LETTER_REPORT_QUERY_KEY, 'fetch', id],
    queryFn: () => getLetterReport(id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!id,
  });
};

export const useSearchLetterReports = (searchParams) => {
  return useQuery({
    queryKey: [...LETTER_REPORT_QUERY_KEY, 'search', searchParams],
    queryFn: () => getLetterReports(searchParams || {}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!searchParams && Object.keys(searchParams || {}).length > 0,
  });
};
