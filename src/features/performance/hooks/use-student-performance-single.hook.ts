import { useQuery } from '@tanstack/react-query';

import { transformToStudentPerformance } from '../helpers/performance-transform.helper';
import { getStudentPerformanceByCurrentStudentUser } from '../api/student-performance.api';

import type { StudentPerformance } from '../models/performance.model';

type Result = {
  student?: StudentPerformance | null;
  loading?: boolean;
};

export function useStudentPerformanceSingle(): Result {
  const { data: student, isLoading, isRefetching } = useQuery(
    getStudentPerformanceByCurrentStudentUser(
      {},
      {
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToStudentPerformance(data);
        },
      },
    ),
  );

  return { loading: isLoading || isRefetching, student };
}
