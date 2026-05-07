import { get } from './axios';

const BASE_URL = '/letterreport/';

export const getLetterReports = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

  return await get(url);
};

export const getLetterReport = (id) => get(`${BASE_URL}${id}/`);
