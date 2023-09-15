import { ApiError } from '#/utils/api.util';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryLessonKey } from '#/config/react-query-keys.config';
import {
  transformToLesson,
  transformToLessonUpsertDto,
} from '../helpers/lesson-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import type { PaginatedQueryData } from '#/core/models/core.model';
import type { QueryPagination } from '#/base/models/base.model';
import type { Lesson, LessonUpsertFormData } from '../models/lesson.model';

const BASE_URL = 'lessons';

export function getPaginatedLessonsByCurrentTeacherUser(
  keys?: {
    q?: string;
    status?: string;
    sort?: string;
    pagination?: Omit<QueryPagination, 'totalCount'>;
  },
  options?: Omit<
    UseQueryOptions<
      PaginatedQueryData<Lesson>,
      Error,
      PaginatedQueryData<Lesson>,
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
      const lessons = await kyInstance.get(url, { searchParams }).json();
      return lessons;
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new ApiError(errorRes.message, errorRes.statusCode);
    }
  };

  return {
    queryKey: [...queryLessonKey.list, { q, status, sort, skip, take }],
    queryFn,
    ...options,
  };
}

export function getLessonBySlugAndCurrentTeacherUser(
  keys: { slug: string; exclude?: string; include?: string },
  options?: Omit<UseQueryOptions<Lesson, Error, Lesson, any>, 'queryFn'>,
) {
  const { slug, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${slug}/teachers`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const lesson = await kyInstance.get(url, { searchParams }).json();
      return lesson;
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new ApiError(errorRes.message, errorRes.statusCode);
    }
  };

  return {
    queryKey: [...queryLessonKey.single, { slug, exclude, include }],
    queryFn,
    ...options,
  };
}

export function createLesson(
  options?: Omit<
    UseMutationOptions<Lesson, Error, LessonUpsertFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: LessonUpsertFormData): Promise<any> => {
    const json = transformToLessonUpsertDto(data);

    try {
      const lesson = await kyInstance.post(BASE_URL, { json }).json();
      return transformToLesson(lesson);
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new ApiError(errorRes.message, errorRes.statusCode);
    }
  };

  return { mutationFn, ...options };
}

export function editLesson(
  options?: Omit<
    UseMutationOptions<
      Lesson,
      Error,
      { slug: string; data: LessonUpsertFormData; scheduleId?: number },
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
    data: LessonUpsertFormData;
    scheduleId?: number;
  }): Promise<any> => {
    const url = `${BASE_URL}/${slug}`;
    const json = transformToLessonUpsertDto(data);
    const searchParams = generateSearchParams({
      schedule: scheduleId?.toString(),
    });

    try {
      const lesson = await kyInstance.patch(url, { json, searchParams }).json();
      return transformToLesson(lesson);
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new ApiError(errorRes.message, errorRes.statusCode);
    }
  };

  return { mutationFn, ...options };
}
