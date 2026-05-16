import { apiRequest } from './client';

export const fetchAllEvents = (token, signal) =>
  apiRequest('/events', { token, signal });

export const fetchUserEvents = (userId, token, signal) =>
  apiRequest(`/events/user/${userId}`, { token, signal });

export const fetchEventById = (eventId, token, signal) =>
  apiRequest(`/events/${eventId}`, { token, signal });

export const createEvent = (formData, token) =>
  apiRequest('/events/', {
    method: 'POST',
    body: formData,
    token,
  });

export const deleteEvent = (eventId, token) =>
  apiRequest(`/events/${eventId}`, { method: 'DELETE', token });
