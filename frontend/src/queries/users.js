import { useQuery } from '@tanstack/react-query';

import { fetchUser } from '../api/users';

export const userKeys = {
  byId: (userId) => ['users', userId],
};

export function useUser(userId, token) {
  return useQuery({
    queryKey: userKeys.byId(userId),
    queryFn: ({ signal }) => fetchUser(userId, token, signal),
    enabled: Boolean(userId),
  });
}
