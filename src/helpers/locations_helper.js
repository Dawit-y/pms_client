import { get, post, put, patch, del } from './axios';

const BASE_URL = '/locations/';
const PRIMARY_KEY = 'uuid';

// Basic CRUD Operations
export const getLocations = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
  return await get(url);
};

export const addLocation = (data) => post(BASE_URL, data);

export const getLocation = (uuid) => get(`${BASE_URL}${uuid}/`);

export const updateLocation = (data) => {
  const uuid = data?.[PRIMARY_KEY];
  return put(`${BASE_URL}${uuid}/`, data);
};

export const partialUpdateLocation = (uuid, data) =>
  patch(`${BASE_URL}${uuid}/`, data);

export const deleteLocation = (uuid) => del(`${BASE_URL}${uuid}/`);

// Tree and Hierarchy Operations
export const getLocationTree = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${BASE_URL}tree/?${queryString}`
    : `${BASE_URL}tree/`;
  return await get(url);
};

export const getLocationChildren = (uuid, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${BASE_URL}${uuid}/children/?${queryString}`
    : `${BASE_URL}${uuid}/children/`;
  return get(url);
};

export const moveLocation = (uuid, newParentUuid = null) =>
  post(`${BASE_URL}${uuid}/move/`, { parent_uuid: newParentUuid });

// Bulk Operations
export const bulkDeleteLocations = (uuids) =>
  post(`${BASE_URL}bulk-delete/`, { uuids });

export const bulkRestoreLocations = (uuids) =>
  post(`${BASE_URL}bulk-restore/`, { uuids });

// Advanced Operations
export const hardDeleteLocation = (uuid) =>
  del(`${BASE_URL}${uuid}/hard-delete/`);

export const restoreLocation = (uuid) => post(`${BASE_URL}${uuid}/restore/`);
