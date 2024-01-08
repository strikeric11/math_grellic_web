import { defer } from 'react-router-dom';

import {
  getPaginatedStudentsByCurrentTeacherUser,
  getStudentByIdAndCurrentTeacherUser,
} from '../api/teacher-user.api';
import { defaultParamKeys } from '../hooks/use-student-user-list.hook';

import type { LoaderFunctionArgs } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';

export function getStudentUserByIdLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.id) {
      return;
    }

    const keys = { ...queryParams, id: +params.id };
    const query = getStudentByIdAndCurrentTeacherUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getPaginatedStudentUserLoader(queryClient: QueryClient) {
  return async () => {
    const query = getPaginatedStudentsByCurrentTeacherUser(defaultParamKeys);
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
