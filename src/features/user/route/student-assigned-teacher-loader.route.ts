import { defer } from 'react-router-dom';

import { getAssignedTeacherByCurrentStudentUser } from '../api/student-user.api';

import type { QueryClient } from '@tanstack/react-query';

export function getStudentAssignedTeacherLoader(queryClient: QueryClient) {
  return async () => {
    const query = getAssignedTeacherByCurrentStudentUser();
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
