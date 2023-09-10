import { kyInstance } from '#/config/ky.config';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import type { StudentUserAccount } from '../models/user.model';

const BASE_URL = 'users';

export function getStudentsByCurrentTeacherUser(
  q?: string,
  options?: Omit<
    UseQueryOptions<StudentUserAccount[], Error, StudentUserAccount[], any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const searchTerm = !q?.trim() ? '' : `?q=${q}`;
    const url = `${BASE_URL}/teachers/students${searchTerm}`;

    try {
      const students = await kyInstance.get(url).json();
      return students;
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new Error(errorRes.message);
    }
  };

  return {
    queryKey: ['users', 'students', { q }],
    queryFn,
    ...options,
  };
}
