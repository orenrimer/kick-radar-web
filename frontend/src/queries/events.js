import { useQuery } from '@tanstack/react-query';

import { fetchAllEvents, fetchUserEvents, fetchEventById } from '../api/events';

export const eventKeys = {
  all: (near) => ['events', near ?? null],
  user: (userId) => ['events', 'user', userId],
  byId: (eventId) => ['events', eventId],
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

export function useEvent(eventId, token) {
  return useQuery({
    queryKey: eventKeys.byId(eventId),
    queryFn: ({ signal }) => fetchEventById(eventId, token, signal),
    enabled: Boolean(eventId),
  });
}
