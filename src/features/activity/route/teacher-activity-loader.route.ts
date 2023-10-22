import { defer } from 'react-router-dom';

import {
  getActivityBySlugAndCurrentTeacherUser,
  getPaginatedActivitiesByCurrentTeacherUser,
} from '../api/teacher-activity.api';
import { defaultParamKeys } from '../hooks/use-teacher-activity-list.hook';

import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export function getActivityBySlugLoader(
  queryClient: QueryClient,
  queryParams?: { status?: string; exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.slug) {
      return;
    }

    const keys = { ...queryParams, slug: params.slug };
    const query = getActivityBySlugAndCurrentTeacherUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getPaginatedActivitiesLoader(queryClient: QueryClient) {
  return async () => {
    const query = getPaginatedActivitiesByCurrentTeacherUser(defaultParamKeys);
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
