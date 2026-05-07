import { get, post, put, patch, del } from './axios';

const BASE_URL = '/groups/';
const PRIMARY_KEY = 'id';

// Basic CRUD Operations
export const getRoles = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
  return await get(url);
};

export const addRole = (data) => post(BASE_URL, data);

export const getRole = (id) => get(`${BASE_URL}${id}/`);

export const updateRole = (data) => {
  const id = data?.[PRIMARY_KEY];
  return put(`${BASE_URL}${id}/`, data);
};

export const partialUpdateRole = (id, data) => patch(`${BASE_URL}${id}/`, data);

export const deleteRole = (id) => del(`${BASE_URL}${id}/`);

// Permission Management
export const addPermissionsToRole = (id, permissionIds) =>
  post(`${BASE_URL}${id}/add_permissions/`, { permission_ids: permissionIds });

export const removePermissionsFromRole = (id, permissionIds) =>
  post(`${BASE_URL}${id}/remove_permissions/`, {
    permission_ids: permissionIds,
  });

// User Management
export const getRoleUsers = (id, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${BASE_URL}${id}/users/?${queryString}`
    : `${BASE_URL}${id}/users/`;
  return get(url);
};
