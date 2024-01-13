import { useQuery } from '@tanstack/react-query';

import { getLessonPerformanceByCurrentTeacherUser } from '../api/teacher-performance.api';

import type { TeacherLessonPerformance } from '../models/performance.model';

type Result = {
  lessonPerformance?: TeacherLessonPerformance;
  loading?: boolean;
};

export function useTeacherLessonPerformanceOverview(): Result {
  const {
    data: lessonPerformance,
    isLoading,
    isRefetching,
  } = useQuery(
    getLessonPerformanceByCurrentTeacherUser({
      refetchOnWindowFocus: false,
    }),
  );

  return { loading: isLoading || isRefetching, lessonPerformance };
}
