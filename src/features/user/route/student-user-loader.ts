import { defer } from 'react-router-dom';

import {
  getPaginatedStudentsByCurrentTeacherUser,
  getStudentByPublicIdAndCurrentTeacherUser,
} from '../api/user.api';
import { defaultParamKeys } from '../hooks/use-student-list.hook';

import type { LoaderFunctionArgs } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';

export function getStudentUserBySlugLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.publicId) {
      return;
    }

    const keys = { ...queryParams, publicId: params.publicId };
    const query = getStudentByPublicIdAndCurrentTeacherUser(keys);

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
