import { defer } from 'react-router-dom';

import { getCurrentUser } from '../api/auth.api';

import type { QueryClient } from '@tanstack/react-query';

export function getCurrentUserLoader(queryClient: QueryClient) {
  return async () => {
    const query = getCurrentUser();
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
