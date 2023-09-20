import { defer } from 'react-router-dom';

import {
  getLessonBySlugAndCurrentStudentUser,
  getLessonsByCurrentStudentUser,
} from '../api/student-lesson.api';

import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export function getLessonBySlugLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.slug) {
      return;
    }

    const keys = { ...queryParams, slug: params.slug };
    const query = getLessonBySlugAndCurrentStudentUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getLessonsLoader(queryClient: QueryClient) {
  return async () => {
    const query = getLessonsByCurrentStudentUser();
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
