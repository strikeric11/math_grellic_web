import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  getClassPerformanceByCurrentTeacherUser,
  getPaginatedStudentPerformancesByCurrentTeacherUser,
} from '#/performance/api/teacher-performance.api';
import { transformToStudentPerformance } from '#/performance/helpers/performance-transform.helper';
import { StudentPerformanceType } from '#/performance/models/performance.model';

import type { QueryObserverBaseResult } from '@tanstack/react-query';
import type {
  StudentPerformance,
  TeacherClassPerformance,
} from '#/performance/models/performance.model';

type Result = {
  classLoading: boolean;
  rankingsLoading: boolean;
  teacherClassPerformance: TeacherClassPerformance | null;
  studentRankingsPerformances: StudentPerformance[];
  currentRankingsPerformance: StudentPerformanceType;
  setCurrentRankingsPerformance: (type: StudentPerformanceType) => void;
  refreshClass: QueryObserverBaseResult['refetch'];
  refreshRanking: QueryObserverBaseResult['refetch'];
};

export function useTeacherClassPerformance(): Result {
  const [currentRankingsPerformance, setCurrentRankingsPerformance] = useState(
    StudentPerformanceType.Exam,
  );

  const {
    data: teacherClassPerformance,
    isLoading: isClassLoading,
    isRefetching: isClassRefetching,
    refetch: refreshClass,
  } = useQuery(
    getClassPerformanceByCurrentTeacherUser({
      refetchOnWindowFocus: false,
    }),
  );

  const {
    data,
    isLoading: isRankingsLoading,
    isRefetching: isRankingsRefetching,
    refetch: refreshRanking,
  } = useQuery(
    getPaginatedStudentPerformancesByCurrentTeacherUser(
      {
        q: undefined,
        performance: currentRankingsPerformance,
        sort: 'rank,asc',
        pagination: { take: 5, skip: 0 },
      },
      {
        refetchOnWindowFocus: false,
        select: (data: any[]) => {
          const [items, totalCount] = data;
          const transformedItems =
            items?.map((item: unknown) =>
              transformToStudentPerformance(item),
            ) || [];

          return [transformedItems, +totalCount];
        },
      },
    ),
  );

  const studentRankingsPerformances = useMemo(() => {
    const [items] = data || [];
    return (items || []) as StudentPerformance[];
  }, [data]);

  return {
    classLoading: isClassLoading || isClassRefetching,
    rankingsLoading: isRankingsLoading || isRankingsRefetching,
    teacherClassPerformance: teacherClassPerformance || null,
    studentRankingsPerformances,
    currentRankingsPerformance,
    setCurrentRankingsPerformance,
    refreshClass,
    refreshRanking,
  };
}
