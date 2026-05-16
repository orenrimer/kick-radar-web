import { useQuery } from '@tanstack/react-query';
import { fetchAllEvents, fetchUserEvents } from '../api/events';

// Cache keys. `all(near)` is parameterised by the geo filter so that
// different positions/radii get their own cache entries (TanStack Query
// uses structural equality on keys, so equivalent objects match).
export const eventKeys = {
  all: (near) => ['events', near ?? null],
  user: (userId) => ['events', 'user', userId],
};

export function useAllEvents(token, near) {
  return useQuery({
    queryKey: eventKeys.all(near),
    queryFn: ({ signal }) => fetchAllEvents(token, signal, near),
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useUserEvents(userId, token) {
  return useQuery({
    queryKey: eventKeys.user(userId),
    queryFn: ({ signal }) => fetchUserEvents(userId, token, signal),
    enabled: Boolean(userId),
  });
}
