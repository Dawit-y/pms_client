import { get } from './axios';

const BASE_URL = '/permissions/';

// Basic CRUD Operations (Read-only)
export const getPermissions = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
  return await get(url);
};

export const getPermission = (id) => get(`${BASE_URL}${id}/`);

export const getPermissionsByApp = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${BASE_URL}by_app/?${queryString}`
    : `${BASE_URL}by_app/`;
  return await get(url);
};
