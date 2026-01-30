import { request } from './apiClient.js';

const BASE_PATH = '/locations';

export const createActivity = async (locationId, logFormData) => {
  return await request(`${BASE_PATH}/${locationId}/activities`, {
    method: 'POST',
    body: logFormData,
  });
};

export const updateActivity = async (locationId, activityId, logFormData) => {
  return await request(`${BASE_PATH}/${locationId}/activities/${activityId}`, {
    method: 'PUT',
    body: logFormData,
  });
};

export const deleteActivity = async (locationId, activityId) => {
  return await request(`${BASE_PATH}/${locationId}/activities/${activityId}`, {
    method: 'DELETE',
  });
};

export default {
  createActivity,
  updateActivity,
  deleteActivity,
};