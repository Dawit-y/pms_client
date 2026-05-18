import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  cancelReportJob,
  exportReport,
  getReport,
  getReportData,
  getReportJob,
  getReportJobs,
  getReportSummary,
  getReports,
} from '../helpers/reports_helper';

const REPORT_QUERY_KEY = ['report'];
const REPORT_JOB_QUERY_KEY = ['report_job'];

const ACTIVE_STATUSES = new Set(['queued', 'running']);

export const useFetchReports = (isActive = true) => {
  return useQuery({
    queryKey: [...REPORT_QUERY_KEY, 'list'],
    queryFn: getReports,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    enabled: isActive,
  });
};

export const useFetchReport = (code) => {
  return useQuery({
    queryKey: [...REPORT_QUERY_KEY, 'detail', code],
    queryFn: () => getReport(code),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    enabled: !!code,
  });
};

export const useFetchReportData = (code, params = {}, isActive = true) => {
  return useQuery({
    queryKey: [...REPORT_QUERY_KEY, 'data', code, params],
    queryFn: () => getReportData(code, params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    enabled: !!code && isActive,
    keepPreviousData: true,
  });
};

export const useFetchReportSummary = (code, params = {}, isActive = false) => {
  return useQuery({
    queryKey: [...REPORT_QUERY_KEY, 'summary', code, params],
    queryFn: () => getReportSummary(code, params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    enabled: !!code && isActive,
  });
};

export const useExportReport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, payload }) => exportReport(code, payload),
    meta: {
      successMessage: t('report_export_queued'),
      errorMessage: t('report_export_failed'),
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REPORT_JOB_QUERY_KEY });
    },
  });
};

export const useFetchReportJobs = (params = {}, isActive = true) => {
  return useQuery({
    queryKey: [...REPORT_JOB_QUERY_KEY, 'list', params],
    queryFn: () => getReportJobs(params),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
    enabled: isActive,
  });
};

/**
 * Poll a single job until it reaches a terminal status.
 * Pass `enabled = true` only while the user is actively waiting on the job.
 */
export const useFetchReportJob = (uuid, enabled = true) => {
  return useQuery({
    queryKey: [...REPORT_JOB_QUERY_KEY, 'detail', uuid],
    queryFn: () => getReportJob(uuid),
    enabled: !!uuid && enabled,
    refetchOnWindowFocus: false,
    refetchInterval: (query) => {
      const status = query?.state?.data?.data?.status;
      if (!status || ACTIVE_STATUSES.has(status)) return 1500;
      return false;
    },
  });
};

export const useCancelReportJob = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelReportJob,
    meta: {
      successMessage: t('report_job_cancelled'),
      errorMessage: t('report_job_cancel_failed'),
    },
    onSettled: (_data, _error, uuid) => {
      queryClient.invalidateQueries({ queryKey: REPORT_JOB_QUERY_KEY });
      if (uuid) {
        queryClient.invalidateQueries({
          queryKey: [...REPORT_JOB_QUERY_KEY, 'detail', uuid],
        });
      }
    },
  });
};
