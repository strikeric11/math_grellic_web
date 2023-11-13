import { generateApiError } from '#/utils/api.util';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryUserKey } from '#/config/react-query-keys.config';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { QueryPagination } from '#/base/models/base.model';
import type { PaginatedQueryData } from '#/core/models/core.model';
import type { StudentUserAccount } from '../models/user.model';

const BASE_URL = 'users/teachers/students';

export function getPaginatedStudentsByCurrentTeacherUser(
  keys?: {
    q?: string;
    status?: string;
    sort?: string;
    pagination?: Omit<QueryPagination, 'totalCount'>;
  },
  options?: Omit<
    UseQueryOptions<
      PaginatedQueryData<StudentUserAccount>,
      Error,
      PaginatedQueryData<StudentUserAccount>,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const { q, status, sort, pagination } = keys || {};
  const { take, skip } = pagination || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/list`;
    const searchParams = generateSearchParams({
      q,
      status,
      sort,
      skip: skip?.toString() || '0',
      take: take?.toString() || '0',
    });

    try {
      const students = await kyInstance.get(url, { searchParams }).json();
      return students;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryUserKey.studentList, { q, status, sort, skip, take }],
    queryFn,
    ...options,
  };
}

export function getStudentsByCurrentTeacherUser(
  keys?: { q?: string; ids?: number[] },
  options?: Omit<
    UseQueryOptions<StudentUserAccount[], Error, StudentUserAccount[], any>,
    'queryFn'
  >,
) {
  const { q, ids } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/list/all`;
    const searchParams = generateSearchParams({ q, ids: ids?.join(',') });

    try {
      const students = await kyInstance.get(url, { searchParams }).json();
      return students;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryUserKey.allStudentList),
      { q, ids },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getStudentByPublicIdAndCurrentTeacherUser(
  keys: { publicId: string; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<StudentUserAccount, Error, StudentUserAccount, any>,
    'queryFn'
  >,
) {
  const { publicId: pId, exclude, include } = keys;
  const publicId = pId.toLowerCase();

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${publicId}`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const student = await kyInstance.get(url, { searchParams }).json();
      return student;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryUserKey.studentSingle, { publicId, exclude, include }],
    queryFn,
    ...options,
  };
}
