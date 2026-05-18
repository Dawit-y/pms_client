import { get, post } from './axios';

const BASE_URL = '/reports/';
const JOBS_URL = '/reports/jobs/';

const buildQuery = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ''
  );
  if (entries.length === 0) return '';
  return `?${new URLSearchParams(entries).toString()}`;
};

export const getReports = () => get(BASE_URL);

export const getReport = (code) => get(`${BASE_URL}${code}/`);

export const getReportData = (code, params = {}) =>
  get(`${BASE_URL}${code}/data/${buildQuery(params)}`);

export const getReportSummary = (code, params = {}) =>
  get(`${BASE_URL}${code}/summary/${buildQuery(params)}`);

export const exportReport = (code, payload) =>
  post(`${BASE_URL}${code}/export/`, payload);

export const getReportJobs = (params = {}) =>
  get(`${JOBS_URL}${buildQuery(params)}`);

export const getReportJob = (uuid) => get(`${JOBS_URL}${uuid}/`);

export const cancelReportJob = (uuid) => post(`${JOBS_URL}${uuid}/cancel/`, {});
