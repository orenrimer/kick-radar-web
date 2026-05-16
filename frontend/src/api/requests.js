import { apiRequest } from './client';

export const fetchHostRequests = (userId, signal) =>
  apiRequest(`/requests/user/${userId}`, { signal });

export const sendJoinRequest = (payload, token) =>
  apiRequest('/requests/send', { method: 'POST', body: payload, token });

export const updateRequestStatus = (requestId, body, token) =>
  apiRequest(`/requests/${requestId}`, { method: 'PATCH', body, token });

export const cancelJoinRequest = (eventId, userId, token) =>
  apiRequest(`/requests/${eventId}/${userId}`, { method: 'DELETE', token });
