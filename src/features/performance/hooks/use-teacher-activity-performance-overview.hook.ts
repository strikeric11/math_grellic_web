import { useQuery } from '@tanstack/react-query';

import { getActivityPerformanceByCurrentTeacherUser } from '../api/teacher-performance.api';

import type { TeacherActivityPerformance } from '../models/performance.model';

type Result = {
  activityPerformance?: TeacherActivityPerformance;
  loading?: boolean;
};

export function useTeacherActivityPerformanceOverview(): Result {
  const {
    data: activityPerformance,
    isLoading,
    isRefetching,
  } = useQuery(
    getActivityPerformanceByCurrentTeacherUser({
      refetchOnWindowFocus: false,
    }),
  );

  return { loading: isLoading || isRefetching, activityPerformance };
}
