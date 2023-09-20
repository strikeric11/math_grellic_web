import { defer } from 'react-router-dom';

import {
  getLessonBySlugAndCurrentTeacherUser,
  getPaginatedLessonsByCurrentTeacherUser,
} from '../api/teacher-lesson.api';
import { defaultParamKeys } from '../hooks/use-teacher-lesson-list.hook';

import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export function getLessonBySlugLoader(
  queryClient: QueryClient,
  queryParams?: { status?: string; exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.slug) {
      return;
    }

    const keys = { ...queryParams, slug: params.slug };
    const query = getLessonBySlugAndCurrentTeacherUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getPaginatedLessonsLoader(queryClient: QueryClient) {
  return async () => {
    const query = getPaginatedLessonsByCurrentTeacherUser(defaultParamKeys);
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
