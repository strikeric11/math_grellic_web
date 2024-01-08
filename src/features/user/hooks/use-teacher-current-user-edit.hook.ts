import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import {
  transformToTeacherUserAccountFormData,
  transformToUser,
} from '../helpers/user-transform.helper';
import { getCurrentUser } from '../api/auth.api';
import { editCurrentTeacherUser as editCurrentTeacherUserApi } from '../api/teacher-user.api';

import type { User } from '../models/user.model';
import type { TeacherUserUpdateFormData } from '../models/user-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  teacherUserFormData: TeacherUserUpdateFormData | undefined;
  editCurrentTeacherUser: (data: TeacherUserUpdateFormData) => Promise<User>;
};

export function useTeacherCurrenUserEdit(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateEditCurrentTeacherUser, isLoading } = useMutation(
    editCurrentTeacherUserApi({
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

  const teacherUserFormData = useMemo(
    () => (user ? transformToTeacherUserAccountFormData(user) : undefined),
    [user],
  );

  const editCurrentTeacherUser = useCallback(
    async (data: TeacherUserUpdateFormData) => {
      const updatedUser = await mutateEditCurrentTeacherUser(data);
      return updatedUser;
    },
    [mutateEditCurrentTeacherUser],
  );

  return {
    loading: isLoading || isQueryLoading || isQueryFetching,
    isDone,
    setIsDone,
    teacherUserFormData,
    editCurrentTeacherUser,
  };
}
