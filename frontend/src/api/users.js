import { apiRequest } from './client';

export const login = (credentials) =>
  apiRequest('/users/login', { method: 'POST', body: credentials });

export const loginWithGoogle = (credential) =>
  apiRequest('/users/google', { method: 'POST', body: { credential } });

export const signup = (credentials) =>
  apiRequest('/users/signup', { method: 'POST', body: credentials });

export const fetchUser = (userId, token, signal) =>
  apiRequest(`/users/${userId}`, { token, signal });

export const fetchAllUsers = (signal) =>
  apiRequest('/users', { signal });

export const updateUser = (userId, body, token) =>
  apiRequest(`/users/${userId}`, { method: 'PATCH', body, token });
