import { kyInstance } from '#/config/ky.config';
import { queryKey } from '#/config/react-query-key.config';
import {
  transformToStudentUserDto,
  transformToTeacherUserDto,
  transformToUser,
} from '#/user/helpers/user.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import type { User } from '#/user/models/user.model';
import type { AuthRegisterFormData } from '#/user/models/auth.model';

const BASE_URL = 'users/auth';

export function getCurrentUser(
  options?: Omit<
    UseQueryOptions<User | null, Error, User | null, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/me`;

    try {
      const user = await kyInstance.get(url).json();
      return user;
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new Error(errorRes.message);
    }
  };

  return {
    ...queryKey.users.user,
    queryFn,
    ...options,
  };
}

export function registerTeacherUser(
  options?: Omit<
    UseMutationOptions<User | null, Error, AuthRegisterFormData, any>,
    'mutationKey' | 'mutationFn'
  >,
) {
  const mutationFn = async (data: AuthRegisterFormData): Promise<any> => {
    const url = `${BASE_URL}/register-teacher`;
    const json = transformToTeacherUserDto(data);

    try {
      const user = await kyInstance.post(url, { json }).json();
      return transformToUser(user);
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new Error(errorRes.message);
    }
  };

  return {
    ...queryKey.users.createUser,
    mutationFn,
    ...options,
  };
}

export function registerStudentUser(
  options?: Omit<
    UseMutationOptions<User | null, Error, AuthRegisterFormData, any>,
    'mutationKey' | 'mutationFn'
  >,
) {
  const mutationFn = async (data: AuthRegisterFormData): Promise<any> => {
    const url = `${BASE_URL}/register-student`;
    const json = transformToStudentUserDto(data);

    try {
      const user = await kyInstance.post(url, { json }).json();
      return transformToUser(user);
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new Error(errorRes.message);
    }
  };

  return {
    ...queryKey.users.createUser,
    mutationFn,
    ...options,
  };
}
