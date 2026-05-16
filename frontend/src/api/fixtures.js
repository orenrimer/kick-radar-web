import { apiRequest } from './client';

export const fetchFixtures = (date, signal) =>
  apiRequest(`/fixtures?date=${encodeURIComponent(date)}`, { signal });
