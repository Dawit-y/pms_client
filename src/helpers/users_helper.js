import { get, post, put, patch, del } from './axios';

const BASE_URL = '/users/';
const PRIMARY_KEY = 'uuid'; // Changed from 'id' to 'uuid'

// Basic CRUD Operations
export const getUsers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
  return await get(url);
};

export const addUser = (data) => post(BASE_URL, data);

export const getUser = (uuid) => get(`${BASE_URL}${uuid}/`);

export const updateUser = (data) => {
  const uuid = data?.[PRIMARY_KEY];
  return put(`${BASE_URL}${uuid}/`, data);
};

export const partialUpdateUser = (uuid, data) =>
  patch(`${BASE_URL}${uuid}/`, data);

export const deleteUser = (uuid) => del(`${BASE_URL}${uuid}/`);

// New Operations
export const bulkDeleteUsers = (uuids) =>
  post(`${BASE_URL}bulk-delete/`, { uuids });

export const bulkRestoreUsers = (uuids) =>
  post(`${BASE_URL}bulk-restore/`, { uuids });

export const getUserStats = () => get(`${BASE_URL}stats/`);

export const activateUser = (uuid) => post(`${BASE_URL}${uuid}/activate/`);

export const deactivateUser = (uuid) => post(`${BASE_URL}${uuid}/deactivate/`);

export const getUserActivity = (uuid, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${BASE_URL}${uuid}/activity/?${queryString}`
    : `${BASE_URL}${uuid}/activity/`;
  return get(url);
};

export const assignGroupsToUser = (uuid, groupIds) =>
  post(`${BASE_URL}${uuid}/assign-groups/`, { group_ids: groupIds });

export const hardDeleteUser = (uuid) => del(`${BASE_URL}${uuid}/hard-delete/`);

export const restoreUser = (uuid) => post(`${BASE_URL}${uuid}/restore/`);

export const setUserPassword = (uuid, passwordData) =>
  post(`${BASE_URL}${uuid}/set-password/`, passwordData);
