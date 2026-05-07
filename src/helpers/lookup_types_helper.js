import { get, post, put, del } from './axios';

const BASE_URL = '/lookup_types/';
const PRIMARY_KEY = 'uuid';

export const getLookupTypes = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

  return await get(url);
};

export const addLookupType = (data) => post(BASE_URL, data);

export const updateLookupType = (data) => {
  const id = data?.[PRIMARY_KEY];
  return put(`${BASE_URL}${id}/`, data);
};

export const getLookupType = (id) => get(`${BASE_URL}${id}/`);

export const deleteLookupType = (id) => del(`${BASE_URL}${id}/`);
