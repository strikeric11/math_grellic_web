import { defer } from 'react-router-dom';

import {
  getExamBySlugAndCurrentTeacherUser,
  getPaginatedExamsByCurrentTeacherUser,
} from '../api/teacher-exam.api';
import { defaultParamKeys } from '../hooks/use-teacher-exam-list.hook';

import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export function getExamBySlugLoader(
  queryClient: QueryClient,
  queryParams?: { status?: string; exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.slug) {
      return;
    }

    const keys = { ...queryParams, slug: params.slug };
    const query = getExamBySlugAndCurrentTeacherUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getPaginatedExamsLoader(queryClient: QueryClient) {
  return async () => {
    const query = getPaginatedExamsByCurrentTeacherUser(defaultParamKeys);
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
