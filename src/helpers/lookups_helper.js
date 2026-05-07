import { get, post, put, del } from './axios';

const BASE_URL = '/lookups/';
const PRIMARY_KEY = 'uuid';

export const getLookups = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

  return await get(url);
};

export const addLookup = (data) => post(BASE_URL, data);

export const updateLookup = (data) => {
  const id = data?.[PRIMARY_KEY];
  return put(`${BASE_URL}${id}/`, data);
};

export const getLookup = (id) => get(`${BASE_URL}${id}/`);

export const deleteLookup = (id) => del(`${BASE_URL}${id}/`);
