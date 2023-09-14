import { ApiError } from '#/utils/api.util';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryUserKey } from '#/config/react-query-keys.config';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import type { StudentUserAccount } from '../models/user.model';

const BASE_URL = 'users';

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
    const url = `${BASE_URL}/teachers/students`;
    const searchParams = generateSearchParams({ q, ids: ids?.join(',') });

    try {
      const students = await kyInstance.get(url, { searchParams }).json();
      return students;
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new ApiError(errorRes.message, errorRes.statusCode);
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryUserKey.studentList),
      { q, ids },
    ],
    queryFn,
    ...moreOptions,
  };
}
