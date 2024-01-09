import { useQuery } from '@tanstack/react-query';

import { getAssignedTeacherByCurrentStudentUser } from '../api/student-user.api';

import type { User } from '../models/user.model';

type Result = {
  loading: boolean;
  user?: User;
};

export function useStudentAssignedTeacherSingle(): Result {
  const {
    data: user,
    isLoading,
    isFetching,
  } = useQuery(
    getAssignedTeacherByCurrentStudentUser({
      refetchOnWindowFocus: false,
    }),
  );

  return {
    loading: isLoading || isFetching,
    user: user || undefined,
  };
}
