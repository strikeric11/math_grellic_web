import { generateApiError } from '#/utils/api.util';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import {
  transformToStudentUserUpdateDto,
  transformToTeacherUserUpdateDto,
  transformToUser,
} from '../helpers/user-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { QueryPagination } from '#/base/models/base.model';
import type { PaginatedQueryData } from '#/core/models/core.model';
import type { AuthRegisterFormData } from '../models/auth.model';
import type {
  StudentUserAccount,
  User,
  UserApprovalStatus,
} from '../models/user.model';
import type { TeacherUserUpdateFormData } from '../models/user-form-data.model';

const BASE_URL = 'users';
const TEACHER_BASE_URL = `${BASE_URL}/teachers`;

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
    const url = `${TEACHER_BASE_URL}/students/list`;
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
  keys?: { q?: string; ids?: number[]; status?: string },
  options?: Omit<
    UseQueryOptions<StudentUserAccount[], Error, StudentUserAccount[], any>,
    'queryFn'
  >,
) {
  const { q, ids, status } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${TEACHER_BASE_URL}/students/list/all`;
    const searchParams = generateSearchParams({
      q,
      ids: ids?.join(','),
      status,
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
    queryKey: [
      ...(queryKey?.length ? queryKey : queryUserKey.allStudentList),
      { q, ids, status },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getStudentCountByCurrentTeacherUser(
  status?: string,
  options?: Omit<UseQueryOptions<number, Error, number, any>, 'queryFn'>,
) {
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${TEACHER_BASE_URL}/students/count`;
    const searchParams = generateSearchParams({ status });

    try {
      const count = await kyInstance.get(url, { searchParams }).json();
      return count;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryUserKey.allStudentList),
      { status },
    ],
    queryFn,
    ...moreOptions,
  };
}

// Deprecated
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
    const url = `${TEACHER_BASE_URL}/students/${publicId}`;
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

export function getStudentByIdAndCurrentTeacherUser(
  keys: { id: number; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<StudentUserAccount, Error, StudentUserAccount, any>,
    'queryFn'
  >,
) {
  const { id, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${TEACHER_BASE_URL}/students/${id}`;
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
    queryKey: [...queryUserKey.studentSingle, { id, exclude, include }],
    queryFn,
    ...options,
  };
}

export function editCurrentTeacherUser(
  options?: Omit<
    UseMutationOptions<User, Error, TeacherUserUpdateFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: TeacherUserUpdateFormData): Promise<any> => {
    const json = transformToTeacherUserUpdateDto(data);

    try {
      const user = await kyInstance.patch(TEACHER_BASE_URL, { json }).json();
      return transformToUser(user);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editStudent(
  options?: Omit<
    UseMutationOptions<
      User,
      Error,
      { studentId: number; data: AuthRegisterFormData },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    studentId,
    data,
  }: {
    studentId: number;
    data: AuthRegisterFormData;
  }): Promise<any> => {
    const url = `${TEACHER_BASE_URL}/students/${studentId}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, confirmPassword, ...moreData } = data;
    const json = transformToStudentUserUpdateDto(moreData);

    try {
      const user = await kyInstance.patch(url, { json }).json();
      return transformToUser(user);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function deleteStudent(
  options?: Omit<UseMutationOptions<boolean, Error, number, any>, 'mutationFn'>,
) {
  const mutationFn = async (id: number): Promise<boolean> => {
    const url = `${TEACHER_BASE_URL}/students/${id}`;

    try {
      const success: boolean = await kyInstance.delete(url).json();
      return success;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function setStudentApprovalStatus(
  options?: Omit<
    UseMutationOptions<
      { approvalStatus: string; approvalDate: string },
      Error,
      { studentId: number; approvalStatus: UserApprovalStatus },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    studentId,
    approvalStatus,
  }: {
    studentId: number;
    approvalStatus: UserApprovalStatus;
  }): Promise<any> => {
    const url = `${BASE_URL}/approve/${studentId}`;
    const json = { approvalStatus };

    try {
      const userApproval = await kyInstance.patch(url, { json }).json();
      return userApproval;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
