import { defer } from 'react-router-dom';

import { getStudentPerformanceByCurrentStudentUser } from '../api/student-performance.api';

import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export function getPerformanceByCurrentStudentUser(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.publicId) {
      return;
    }

    const keys = { ...queryParams };
    const query = getStudentPerformanceByCurrentStudentUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
