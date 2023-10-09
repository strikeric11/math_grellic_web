import { generateApiError } from '#/utils/api.util';
import { kyInstance } from '#/config/ky.config';
import {
  transformToLessonSchedule,
  transformToLessonScheduleCreateDto,
  transformToLessonScheduleUpdateDto,
} from '../helpers/lesson-transform.helper';

import type { UseMutationOptions } from '@tanstack/react-query';
import type { LessonSchedule } from '../models/lesson.model';
import type { LessonScheduleUpsertFormData } from '../models/lesson-form-data.model';

const BASE_URL = 'lessons';

export function createLessonSchedule(
  options?: Omit<
    UseMutationOptions<
      LessonSchedule,
      Error,
      LessonScheduleUpsertFormData,
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async (
    data: LessonScheduleUpsertFormData,
  ): Promise<any> => {
    const json = transformToLessonScheduleCreateDto(data);

    try {
      const lessonSchedule = await kyInstance
        .post(`${BASE_URL}/schedules`, { json })
        .json();

      return transformToLessonSchedule(lessonSchedule);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editLessonSchedule(
  options?: Omit<
    UseMutationOptions<
      LessonSchedule,
      Error,
      { id: number; data: LessonScheduleUpsertFormData },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    id,
    data,
  }: {
    id: number;
    data: LessonScheduleUpsertFormData;
  }): Promise<any> => {
    const url = `${BASE_URL}/schedules/${id}`;
    const json = transformToLessonScheduleUpdateDto(data);

    try {
      const lessonSchedule = await kyInstance.patch(url, { json }).json();
      return transformToLessonSchedule(lessonSchedule);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
