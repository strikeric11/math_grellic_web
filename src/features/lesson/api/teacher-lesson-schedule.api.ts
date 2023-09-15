import { ApiError } from '#/utils/api.util';
import { kyInstance } from '#/config/ky.config';
import {
  transformToLessonSchedule,
  transformToLessonScheduleUpsertDto,
} from '../helpers/lesson-transform.helper';

import type { UseMutationOptions } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import type {
  LessonSchedule,
  LessonScheduleUpsertFormData,
} from '../models/lesson.model';

const BASE_URL = 'lessons';

export function createSchedule(
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
    const json = transformToLessonScheduleUpsertDto(data);

    try {
      const lessonSchedule = await kyInstance
        .post(`${BASE_URL}/schedules`, { json })
        .json();

      return transformToLessonSchedule(lessonSchedule);
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new ApiError(errorRes.message, errorRes.statusCode);
    }
  };

  return { mutationFn, ...options };
}
