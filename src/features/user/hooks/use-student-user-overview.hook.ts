import { useQuery } from '@tanstack/react-query';

import { queryUserKey } from '#/config/react-query-keys.config';
import { getStudentCountByCurrentTeacherUser } from '../api/teacher-user.api';

type Result = {
  enrolledStudentCount: number;
  loading: boolean;
  refresh: () => void;
};

export function useStudentUserOverview(): Result {
  const { data, isLoading, isFetching, refetch } = useQuery(
    getStudentCountByCurrentTeacherUser(undefined, {
      queryKey: queryUserKey.studentList,
      refetchOnWindowFocus: false,
      initialData: 0,
    }),
  );

  return {
    enrolledStudentCount: data || 0,
    loading: isLoading || isFetching,
    refresh: refetch,
  };
}
