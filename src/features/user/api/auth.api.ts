import { ApiError } from '#/utils/api.util';
import { queryUserKey } from '#/config/react-query-keys.config';
import { kyInstance } from '#/config/ky.config';
import {
  transformToStudentUserCreateDto,
  transformToTeacherUserCreateDto,
  transformToUser,
} from '../helpers/user-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import type { User } from '../models/user.model';
import type { AuthRegisterFormData } from '../models/auth.model';

const BASE_URL = 'users';

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
      throw new ApiError(errorRes.message, errorRes.statusCode);
    }
  };

  return {
    queryKey: queryUserKey.currentUser,
    queryFn,
    ...options,
  };
}

export function registerTeacherUser(
  options?: Omit<
    UseMutationOptions<User | null, Error, AuthRegisterFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: AuthRegisterFormData): Promise<any> => {
    const url = `${BASE_URL}/teachers/register`;
    const json = transformToTeacherUserCreateDto(data);

    try {
      const user = await kyInstance.post(url, { json }).json();
      return transformToUser(user);
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new ApiError(errorRes.message, errorRes.statusCode);
    }
  };

  return { mutationFn, ...options };
}

export function registerStudentUser(
  options?: Omit<
    UseMutationOptions<User | null, Error, AuthRegisterFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: AuthRegisterFormData): Promise<any> => {
    const url = `${BASE_URL}/students/register`;
    const json = transformToStudentUserCreateDto(data);

    try {
      const user = await kyInstance.post(url, { json }).json();
      return transformToUser(user);
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new ApiError(errorRes.message, errorRes.statusCode);
    }
  };

  return { mutationFn, ...options };
}
