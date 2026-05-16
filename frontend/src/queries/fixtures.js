import { useQuery } from '@tanstack/react-query';

import { fetchFixtures } from '../api/fixtures';

export const fixtureKeys = {
  byDate: (date) => ['fixtures', date],
};

export function useFixtures(date) {
  return useQuery({
    queryKey: fixtureKeys.byDate(date),
    queryFn: ({ signal }) => fetchFixtures(date, signal),
    enabled: Boolean(date),
  });
}
