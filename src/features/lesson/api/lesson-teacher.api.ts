import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

import { kyInstance } from '#/config/ky.config';
import {
  transformToLesson,
  transformToLessonCreateDto,
} from '../helpers/lesson-transform.helper';

import type { Lesson, LessonUpsertFormData } from '../models/lesson.model';
import type { HTTPError } from 'ky';

const BASE_URL = 'lessons';

// TODO get lesson by teacher id

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
