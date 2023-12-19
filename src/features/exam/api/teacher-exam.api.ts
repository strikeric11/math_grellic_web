import { generateApiError } from '#/utils/api.util';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryExamKey } from '#/config/react-query-keys.config';
import { QueryPagination } from '#/base/models/base.model';
import { PaginatedQueryData } from '#/core/models/core.model';
import {
  transformToExam,
  transformToExamUpsertDto,
} from '../helpers/exam-transform.helper';
import {
  generateImageFormData,
  generateImageFormDataStrict,
} from '../helpers/exam-form.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { Exam } from '../models/exam.model';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

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
    const url = `${BASE_URL}/teachers/list`;
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

export function getExamSnippetsByCurrentTeacherUser(
  take?: number,
  options?: Omit<UseQueryOptions<Exam[], Error, Exam[], any>, 'queryFn'>,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/teachers/list/snippets`;
    const searchParams = generateSearchParams({ take: take?.toString() });

    try {
      const exams = await kyInstance.get(url, { searchParams }).json();
      return exams;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryExamKey.list, { take }],
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

export function validateUpsertExam(
  options?: Omit<
    UseMutationOptions<
      boolean,
      Error,
      { data: ExamUpsertFormData; slug?: string; scheduleId?: number },
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
    data: ExamUpsertFormData;
    slug?: string;
    scheduleId?: number;
  }): Promise<boolean> => {
    const url = `${BASE_URL}/validate`;
    const json = transformToExamUpsertDto(data);
    const searchParams = generateSearchParams({
      slug: slug?.toString(),
      schedule: scheduleId?.toString(),
    });

    try {
      await kyInstance.post(url, { json, searchParams }).json();
      return true;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function createExam(
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

export function editExam(
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

export function deleteExam(
  options?: Omit<UseMutationOptions<boolean, Error, string, any>, 'mutationFn'>,
) {
  const mutationFn = async (slug: string): Promise<boolean> => {
    const url = `${BASE_URL}/${slug}`;

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

export function uploadExamImages(
  options?: Omit<
    UseMutationOptions<
      string[],
      Error,
      { data: ExamUpsertFormData; strict?: boolean },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async (options: {
    data: ExamUpsertFormData;
    strict?: boolean;
  }): Promise<any> => {
    const { data, strict } = options;
    const url = `upload/${BASE_URL}/images`;
    const { orderNumber, questions } = data;
    const formData = await (strict
      ? generateImageFormDataStrict(orderNumber || 0, questions)
      : generateImageFormData(orderNumber || 0, questions));

    try {
      return kyInstance.post(url, { body: formData }).json();
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
