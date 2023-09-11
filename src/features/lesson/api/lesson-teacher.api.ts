import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryLessonKey } from '#/config/react-query-keys.config';
import {
  transformToLesson,
  transformToLessonCreateDto,
} from '../helpers/lesson-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import type { Lesson, LessonUpsertFormData } from '../models/lesson.model';

const BASE_URL = 'lessons';

export function getLessonsByCurrentTeacherUser(
  keys?: { q?: string },
  options?: Omit<
    UseQueryOptions<Lesson[], Error, Lesson[], any>,
    'queryKey' | 'queryFn'
  >,
) {
  const { q } = keys || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/teachers/list`;
    const searchParams = generateSearchParams({ q });

    try {
      const lessons = await kyInstance.get(url, { searchParams }).json();
      return lessons;
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new Error(errorRes.message);
    }
  };

  return {
    queryKey: [...queryLessonKey.list, { q }],
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
    const json = transformToLessonCreateDto(data);

    try {
      const lesson = await kyInstance.post(BASE_URL, { json }).json();
      return transformToLesson(lesson);
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new Error(errorRes.message);
    }
  };

  return { mutationFn, ...options };
}
