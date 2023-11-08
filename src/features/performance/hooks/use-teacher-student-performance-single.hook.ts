import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getStudentPerformanceByPublicIdAndCurrentTeacherUser } from '../api/teacher-performance.api';
import { transformToStudentPerformance } from '../helpers/performance-transform.helper';

import type { StudentPerformance } from '../models/performance.model';

type Result = {
  loading: boolean;
  student?: StudentPerformance | null;
};

export function useTeacherStudentPerformanceSingle(): Result {
  const { publicId } = useParams();

  const {
    data: student,
    isLoading,
    isFetching,
  } = useQuery(
    getStudentPerformanceByPublicIdAndCurrentTeacherUser(
      { publicId: publicId || '' },
      {
        enabled: !!publicId,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToStudentPerformance(data);
        },
      },
    ),
  );

  return { loading: isLoading || isFetching, student };
}
