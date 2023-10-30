import { defer } from 'react-router-dom';

import {
  getPaginatedStudentPerformancesByCurrentTeacherUser,
  getStudentPerformanceByPublicIdAndCurrentTeacherUser,
} from '../api/teacher-performance.api';
import { defaultParamKeys } from '../hooks/use-student-performance-list.hook';

import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export function getStudentPerformanceByPublicIdLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.publicId) {
      return;
    }

    const keys = { ...queryParams, publicId: params.publicId };
    const query = getStudentPerformanceByPublicIdAndCurrentTeacherUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getPaginatedStudentPerformancesLoader(
  queryClient: QueryClient,
) {
  return async () => {
    const query =
      getPaginatedStudentPerformancesByCurrentTeacherUser(defaultParamKeys);
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
