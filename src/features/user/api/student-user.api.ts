import { generateApiError } from '#/utils/api.util';
import { kyInstance } from '#/config/ky.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import {
  transformToStudentUserUpdateDto,
  transformToUser,
} from '../helpers/user-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { User } from '../models/user.model';
import type { StudentUserUpdateFormData } from '../models/user-form-data.model';

const BASE_URL = 'users/students';

export function getAssignedTeacherByCurrentStudentUser(
  options?: Omit<
    UseQueryOptions<User, Error, User, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/teacher`;

    try {
      const teacher = await kyInstance.get(url).json();
      return transformToUser(teacher);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryUserKey.studentAssignedTeacher],
    queryFn,
    ...options,
  };
}

export function editCurrentStudentUser(
  options?: Omit<
    UseMutationOptions<User, Error, StudentUserUpdateFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: StudentUserUpdateFormData): Promise<any> => {
    const json = transformToStudentUserUpdateDto(data);

    try {
      const user = await kyInstance.patch(BASE_URL, { json }).json();
      return transformToUser(user);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
