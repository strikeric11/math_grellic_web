import { generateApiError } from '#/utils/api.util';
import {
  queryExamKey,
  queryStudentPerformanceKey,
} from '#/config/react-query-keys.config';
import { generateSearchParams, kyInstance } from '#/config/ky.config';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { QueryPagination } from '#/base/models/base.model';
import type { PaginatedQueryData } from '#/core/models/core.model';
import type { Exam } from '#/exam/models/exam.model';
import type { StudentPerformance } from '../models/performance.model';

const BASE_URL = 'performances/teachers/students';

export function getPaginatedStudentPerformancesByCurrentTeacherUser(
  keys?: {
    q?: string;
    performance?: string;
    sort?: string;
    pagination?: Omit<QueryPagination, 'totalCount'>;
  },
  options?: Omit<
    UseQueryOptions<
      PaginatedQueryData<StudentPerformance>,
      Error,
      PaginatedQueryData<StudentPerformance>,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const { q, performance, sort, pagination } = keys || {};
  const { take, skip } = pagination || {};

  const queryFn = async (): Promise<any> => {
    const searchParams = generateSearchParams({
      q,
      perf: performance,
      sort,
      skip: skip?.toString() || '0',
      take: take?.toString() || '0',
    });

    try {
      const students = await kyInstance
        .get(`${BASE_URL}/list`, { searchParams })
        .json();
      return students;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...queryStudentPerformanceKey.list,
      { q, performance, sort, skip, take },
    ],
    queryFn,
    ...options,
  };
}

export function getStudentPerformanceByPublicIdAndCurrentTeacherUser(
  keys: { publicId: string; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<StudentPerformance, Error, StudentPerformance, any>,
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
    queryKey: [
      ...queryStudentPerformanceKey.single,
      { publicId, exclude, include },
    ],
    queryFn,
    ...options,
  };
}

export function getStudentExamsByPublicIdAndCurrentTeacherUser(
  keys: { publicId: string; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Exam[], Error, Exam[], any>, 'queryFn'>,
) {
  const { publicId: pId, exclude, include } = keys;
  const publicId = pId.toLowerCase();

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${publicId}/exams`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const exams = await kyInstance.get(url, { searchParams }).json();
      return exams;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...queryExamKey.studentPerformance,
      { publicId, exclude, include },
    ],
    queryFn,
    ...options,
  };
}

export function getStudentExamWithCompletionsByPublicIdAndSlug(
  keys: { publicId: string; slug: string; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Exam, Error, Exam, any>, 'queryFn'>,
) {
  const { publicId: pId, slug, exclude, include } = keys;
  const publicId = pId.toLowerCase();

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${publicId}/exams/${slug}`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const exam = await kyInstance.get(url, { searchParams }).json();
      return exam;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryExamKey.single, { publicId, slug, exclude, include }],
    queryFn,
    ...options,
  };
}
