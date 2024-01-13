import dayjs from '#/config/dayjs.config';
import { generateApiError } from '#/utils/api.util';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryScheduleKey } from '#/config/react-query-keys.config';
import {
  transformToMeetingScheduleUpsertDto,
  transformToMeetingSchedule,
} from '../helpers/schedule-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { QueryPagination } from '#/base/models/base.model';
import type { PaginatedQueryData } from '#/core/models/core.model';
import type {
  MeetingSchedule,
  TimelineSchedules,
} from '../models/schedule.model';
import type { MeetingScheduleUpsertFormData } from '../models/schedule-form-data.model';

const BASE_URL = 'schedules';

export function getSchedulesByDateRangeAndCurrentTeacherUser(
  keys: { from: Date; to: Date },
  options?: Omit<
    UseQueryOptions<TimelineSchedules, Error, TimelineSchedules, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const { from, to } = keys || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/teachers`;
    const searchParams = generateSearchParams({
      from: dayjs(from).format('YYYY-MM-DD'),
      to: dayjs(to).format('YYYY-MM-DD'),
    });

    try {
      const timelineSchedules = await kyInstance
        .get(url, { searchParams })
        .json();
      return timelineSchedules;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryScheduleKey.timeline, { from, to }],
    queryFn,
    ...options,
  };
}

export function getSchedulesByDateAndCurrentTeacherUser(
  date: Date,
  options?: Omit<
    UseQueryOptions<TimelineSchedules, Error, TimelineSchedules, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/teachers`;
    const searchParams = generateSearchParams({
      from: dayjs(date).format('YYYY-MM-DD'),
      to: dayjs(date).add(1, 'day').format('YYYY-MM-DD'),
    });

    try {
      const timelineSchedules = await kyInstance
        .get(url, { searchParams })
        .json();
      return timelineSchedules;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryScheduleKey.daily, { date }],
    queryFn,
    ...options,
  };
}

export function getPaginatedMeetingSchedulesByCurrentTeacherUser(
  keys?: {
    q?: string;
    sort?: string;
    pagination?: Omit<QueryPagination, 'totalCount'>;
  },
  options?: Omit<
    UseQueryOptions<
      PaginatedQueryData<MeetingSchedule>,
      Error,
      PaginatedQueryData<MeetingSchedule>,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const { q, sort, pagination } = keys || {};
  const { take, skip } = pagination || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/meetings/teachers`;
    const searchParams = generateSearchParams({
      q,
      sort,
      skip: skip?.toString() || '0',
      take: take?.toString() || '0',
    });

    try {
      const meetingSchedules = await kyInstance
        .get(url, { searchParams })
        .json();
      return meetingSchedules;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryScheduleKey.list, { q, sort, skip, take }],
    queryFn,
    ...options,
  };
}

export function getMeetingScheduleByIdAndCurrentTeacherUser(
  keys: { id: number; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<MeetingSchedule, Error, MeetingSchedule, any>,
    'queryFn'
  >,
) {
  const { id, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${id}/teachers`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const meetingSchedule = await kyInstance
        .get(url, { searchParams })
        .json();
      return meetingSchedule;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryScheduleKey.single, { id, exclude, include }],
    queryFn,
    ...options,
  };
}

export function createMeetingSchedule(
  options?: Omit<
    UseMutationOptions<
      MeetingSchedule,
      Error,
      MeetingScheduleUpsertFormData,
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async (
    data: MeetingScheduleUpsertFormData,
  ): Promise<any> => {
    const json = transformToMeetingScheduleUpsertDto(data);

    try {
      const meetingSchedule = await kyInstance.post(BASE_URL, { json }).json();
      return transformToMeetingSchedule(meetingSchedule);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editMeetingSchedule(
  options?: Omit<
    UseMutationOptions<
      MeetingSchedule,
      Error,
      { id: number; data: MeetingScheduleUpsertFormData },
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
    data: MeetingScheduleUpsertFormData;
  }): Promise<any> => {
    const url = `${BASE_URL}/${id}`;
    const json = transformToMeetingScheduleUpsertDto(data);

    try {
      const meetingSchedule = await kyInstance.patch(url, { json }).json();
      return transformToMeetingSchedule(meetingSchedule);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function deleteMeetingSchedule(
  options?: Omit<UseMutationOptions<boolean, Error, number, any>, 'mutationFn'>,
) {
  const mutationFn = async (id: number): Promise<boolean> => {
    const url = `${BASE_URL}/${id}`;

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
