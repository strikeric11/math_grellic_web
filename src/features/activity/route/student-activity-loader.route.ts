import { defer } from 'react-router-dom';

import {
  getActivitiesByCurrentStudentUser,
  getActivityBySlugAndCurrentStudentUser,
} from '../api/student-activity.api';

import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export function getActivityBySlugLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.slug) {
      return;
    }

    const keys = { ...queryParams, slug: params.slug };
    const query = getActivityBySlugAndCurrentStudentUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getActivitiesLoader(queryClient: QueryClient) {
  return async () => {
    const query = getActivitiesByCurrentStudentUser();
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
