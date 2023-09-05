import ky from 'ky';

import { queryKey } from '../../../config/react-query-key.config';
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

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/users`;

export function getCurrentUser(
  options?: Omit<
    UseQueryOptions<User | null, Error, User | null, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${API_URL}/auth/me`;

    try {
      const user = await ky.get(url, { credentials: 'include' }).json();
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
    const url = `${API_URL}/auth/register-teacher`;
    const json = transformToTeacherUserDto(data);

    try {
      const user = await ky.post(url, { credentials: 'include', json }).json();
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
    const url = `${API_URL}/auth/register-student`;
    const json = transformToStudentUserDto(data);

    try {
      const user = await ky.post(url, { credentials: 'include', json }).json();
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
