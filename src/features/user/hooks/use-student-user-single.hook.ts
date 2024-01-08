import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { transformToStudentUserAccount } from '../helpers/user-transform.helper';
import { getStudentByIdAndCurrentTeacherUser } from '../api/teacher-user.api';

import type { StudentUserAccount } from '../models/user.model';

type Result = {
  loading: boolean;
  student?: StudentUserAccount;
};

export function useStudentUserSingle(): Result {
  const { id } = useParams();

  const {
    data: student,
    isLoading,
    isFetching,
  } = useQuery(
    getStudentByIdAndCurrentTeacherUser(
      { id: +(id || 0) },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToStudentUserAccount(data);
        },
      },
    ),
  );

  return {
    loading: isLoading || isFetching,
    student,
  };
}
