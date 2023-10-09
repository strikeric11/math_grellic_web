import type { UseMutationOptions } from '@tanstack/react-query';

import { generateApiError } from '#/utils/api.util';
import { kyInstance } from '#/config/ky.config';
import {
  transformToExamSchedule,
  transformToExamScheduleCreateDto,
  transformToExamScheduleUpdateDto,
} from '../helpers/exam-transform.helper';

import type { ExamSchedule } from '../models/exam.model';
import type { ExamScheduleUpsertFormData } from '../models/exam-form-data.model';

const BASE_URL = 'exams';

export function createExamSchedule(
  options?: Omit<
    UseMutationOptions<ExamSchedule, Error, ExamScheduleUpsertFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: ExamScheduleUpsertFormData): Promise<any> => {
    const json = transformToExamScheduleCreateDto(data);

    try {
      const examSchedule = await kyInstance
        .post(`${BASE_URL}/schedules`, { json })
        .json();

      return transformToExamSchedule(examSchedule);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editExamSchedule(
  options?: Omit<
    UseMutationOptions<
      ExamSchedule,
      Error,
      { id: number; data: ExamScheduleUpsertFormData },
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
    data: ExamScheduleUpsertFormData;
  }): Promise<any> => {
    const url = `${BASE_URL}/schedules/${id}`;
    const json = transformToExamScheduleUpdateDto(data);

    try {
      const examSchedule = await kyInstance.patch(url, { json }).json();
      return transformToExamSchedule(examSchedule);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function deleteExamSchedule(
  options?: Omit<UseMutationOptions<boolean, Error, number, any>, 'mutationFn'>,
) {
  const mutationFn = async (id: number): Promise<boolean> => {
    const url = `${BASE_URL}/schedules/${id}`;

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
