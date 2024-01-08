import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import { transformToStudentUserAccount } from '../helpers/user-transform.helper';
import {
  getStudentsByCurrentTeacherUser,
  setStudentApprovalStatus as setStudentApprovalStatusApi,
  deleteStudent as deleteStudentApi,
} from '../api/teacher-user.api';
import { UserApprovalStatus } from '../models/user.model';

import type { StudentUserAccount } from '../models/user.model';

type Result = {
  pendingStudents: StudentUserAccount[];
  loading: boolean;
  isMutateLoading: boolean;
  refresh: () => void;
  setStudentApprovalStatus: (
    id: number,
    approvalStatus: UserApprovalStatus,
  ) => Promise<any>;
  deleteStudent: (id: number) => Promise<boolean | undefined>;
};

export function useStudentUserPendingEnrollmentList(): Result {
  const {
    data: pendingStudents,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    getStudentsByCurrentTeacherUser(
      { status: UserApprovalStatus.Pending },
      {
        queryKey: queryUserKey.studentList,
        refetchOnWindowFocus: false,
        initialData: [],
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToStudentUserAccount(item))
            : [],
      },
    ),
  );

  const {
    mutateAsync: mutateSetStudentApprovalStatus,
    isLoading: isStatusLoading,
  } = useMutation(setStudentApprovalStatusApi());

  const { mutateAsync: mutateDeleteStudent, isLoading: isDeleteLoading } =
    useMutation(deleteStudentApi());

  const setStudentApprovalStatus = useCallback(
    async (id: number, approvalStatus: UserApprovalStatus) => {
      const result = await mutateSetStudentApprovalStatus({
        studentId: id,
        approvalStatus,
      });

      queryClient.invalidateQueries({
        queryKey: queryUserKey.studentList,
      });

      queryClient.invalidateQueries({
        queryKey: [...queryUserKey.studentSingle, { id }],
      });

      return result;
    },
    [mutateSetStudentApprovalStatus],
  );

  const deleteStudent = useCallback(
    async (id: number) => {
      const result = await mutateDeleteStudent(id);

      queryClient.invalidateQueries({
        queryKey: queryUserKey.studentList,
      });

      queryClient.invalidateQueries({
        queryKey: [...queryUserKey.studentSingle, { id }],
      });

      return result;
    },
    [mutateDeleteStudent],
  );

  return {
    pendingStudents: pendingStudents as StudentUserAccount[],
    loading: isLoading || isFetching,
    isMutateLoading: isStatusLoading || isDeleteLoading,
    refresh: refetch,
    setStudentApprovalStatus,
    deleteStudent,
  };
}
