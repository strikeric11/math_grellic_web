import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import {
  transformToStudentUserAccountFormData,
  transformToUser,
} from '../helpers/user-transform.helper';
import { getCurrentUser } from '../api/auth.api';
import { editCurrentStudentUser as editCurrentStudentUserApi } from '../api/student-user.api';

import type { User } from '../models/user.model';
import type { StudentUserUpdateFormData } from '../models/user-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  studentUserFormData: StudentUserUpdateFormData | undefined;
  editCurrentStudentUser: (data: StudentUserUpdateFormData) => Promise<User>;
};

export function useStudentCurrenUserEdit(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateEditCurrentStudentUser, isLoading } = useMutation(
    editCurrentStudentUserApi({
      onSuccess: () =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryUserKey.currentUser,
          }),
        ]),
    }),
  );

  const {
    data: user,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getCurrentUser({
      refetchOnWindowFocus: false,
      select: (data: any) => {
        return transformToUser(data);
      },
    }),
  );

  const studentUserFormData = useMemo(
    () => (user ? transformToStudentUserAccountFormData(user) : undefined),
    [user],
  );

  const editCurrentStudentUser = useCallback(
    async (data: StudentUserUpdateFormData) => {
      const updatedUser = await mutateEditCurrentStudentUser(data);
      return updatedUser;
    },
    [mutateEditCurrentStudentUser],
  );

  return {
    loading: isLoading || isQueryLoading || isQueryFetching,
    isDone,
    setIsDone,
    studentUserFormData,
    editCurrentStudentUser,
  };
}
