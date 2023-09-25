import { generateApiError } from '#/utils/api.util';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryExamKey } from '#/config/react-query-keys.config';
import { QueryPagination } from '#/base/models/base.model';
import { PaginatedQueryData } from '#/core/models/core.model';
import {
  transformToExam,
  transformToExamUpsertDto,
} from '../helpers/exam-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { Exam, ExamUpsertFormData } from '../models/exam.model';

const BASE_URL = 'exams';

export function getPaginatedExamsByCurrentTeacherUser(
  keys?: {
    q?: string;
    status?: string;
    sort?: string;
    pagination?: Omit<QueryPagination, 'totalCount'>;
  },
  options?: Omit<
    UseQueryOptions<
      PaginatedQueryData<Exam>,
      Error,
      PaginatedQueryData<Exam>,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const { q, status, sort, pagination } = keys || {};
  const { take, skip } = pagination || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/exams/list`;
    const searchParams = generateSearchParams({
      q,
      status,
      sort,
      skip: skip?.toString() || '0',
      take: take?.toString() || '0',
    });

    try {
      const exams = await kyInstance.get(url, { searchParams }).json();
      return exams;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryExamKey.list, { q, status, sort, skip, take }],
    queryFn,
    ...options,
  };
}

export function getExamBySlugAndCurrentTeacherUser(
  keys: { slug: string; status?: string; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Exam, Error, Exam, any>, 'queryFn'>,
) {
  const { slug, status, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${slug}/teachers`;
    const searchParams = generateSearchParams({ status, exclude, include });

    try {
      const exam = await kyInstance.get(url, { searchParams }).json();
      return exam;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryExamKey.single, { slug, status, exclude, include }],
    queryFn,
    ...options,
  };
}

export function createExan(
  options?: Omit<
    UseMutationOptions<Exam, Error, ExamUpsertFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: ExamUpsertFormData): Promise<any> => {
    const json = transformToExamUpsertDto(data);

    try {
      const exam = await kyInstance.post(BASE_URL, { json }).json();
      return transformToExam(exam);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editLesson(
  options?: Omit<
    UseMutationOptions<
      Exam,
      Error,
      { slug: string; data: ExamUpsertFormData; scheduleId?: number },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    slug,
    data,
    scheduleId,
  }: {
    slug: string;
    data: ExamUpsertFormData;
    scheduleId?: number;
  }): Promise<any> => {
    const url = `${BASE_URL}/${slug}`;
    const json = transformToExamUpsertDto(data);
    const searchParams = generateSearchParams({
      schedule: scheduleId?.toString(),
    });

    try {
      const exam = await kyInstance.patch(url, { json, searchParams }).json();
      return transformToExam(exam);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
