import { useQuery } from '@tanstack/react-query';
import { fetchAllEvents, fetchUserEvents } from '../api/events';

export const eventKeys = {
  all: ['events'],
  user: (userId) => ['events', 'user', userId],
};

export function useAllEvents(token) {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: ({ signal }) => fetchAllEvents(token, signal),
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
