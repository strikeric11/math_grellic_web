import { kyInstance } from '#/config/ky.config';

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
  const { ids, q } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const searchTerm = !q?.trim() ? '' : `?q=${q}`;

    let selectedIds = '';
    if (ids?.length) {
      const joinedIds = ids.join(',');
      selectedIds = searchTerm ? `&ids=${joinedIds}` : `?ids=${joinedIds}`;
    }

    const url = `${BASE_URL}/teachers/students${searchTerm}${selectedIds}`;

    try {
      const students = await kyInstance.get(url).json();
      return students;
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new Error(errorRes.message);
    }
  };

  return {
    queryKey: queryKey?.length
      ? [...queryKey, { q, ids }]
      : ['users', 'students', { q, ids }],
    queryFn,
    ...moreOptions,
  };
}
