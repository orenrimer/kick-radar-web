import { apiRequest } from './client';

// `near` is an optional { lat, lng, radiusKm } that filters events
// server-side via the 2dsphere index. Omit it to fetch all events.
export const fetchAllEvents = (token, signal, near) => {
  let path = '/events';
  if (near && Number.isFinite(near.lat) && Number.isFinite(near.lng) && near.radiusKm > 0) {
    const params = new URLSearchParams({
      lat: String(near.lat),
      lng: String(near.lng),
      radius: String(near.radiusKm),
    });
    path = `${path}?${params.toString()}`;
  }
  return apiRequest(path, { token, signal });
};

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
