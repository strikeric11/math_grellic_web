import { useQuery } from '@tanstack/react-query';

import { getExamPerformanceByCurrentTeacherUser } from '../api/teacher-performance.api';

import type { TeacherExamPerformance } from '../models/performance.model';

type Result = {
  examPerformance?: TeacherExamPerformance;
  loading?: boolean;
};

export function useTeacherExamPerformanceOverview(): Result {
  const {
    data: examPerformance,
    isLoading,
    isRefetching,
  } = useQuery(
    getExamPerformanceByCurrentTeacherUser({
      refetchOnWindowFocus: false,
    }),
  );

  return { loading: isLoading || isRefetching, examPerformance };
}
