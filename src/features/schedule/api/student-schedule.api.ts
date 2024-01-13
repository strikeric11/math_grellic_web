import dayjs from '#/config/dayjs.config';
import { generateApiError } from '#/utils/api.util';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryScheduleKey } from '#/config/react-query-keys.config';

import type { UseQueryOptions } from '@tanstack/react-query';
import type {
  MeetingSchedule,
  StudentMeetingScheduleList,
  TimelineSchedules,
} from '../models/schedule.model';

const BASE_URL = 'schedules';

export function getSchedulesByDateRangeAndCurrentStudentUser(
  keys: { from: Date; to: Date },
  options?: Omit<
    UseQueryOptions<TimelineSchedules, Error, TimelineSchedules, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const { from, to } = keys || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/students`;
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

export function getSchedulesByDateAndCurrentStudentUser(
  date: Date,
  options?: Omit<
    UseQueryOptions<TimelineSchedules, Error, TimelineSchedules, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/students`;
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

export function getMeetingSchedulesByCurrentStudentUser(
  options?: Omit<
    UseQueryOptions<
      StudentMeetingScheduleList,
      Error,
      StudentMeetingScheduleList,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/meetings/students`;

    try {
      const meetingSchedules = await kyInstance.get(url).json();
      return meetingSchedules;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryScheduleKey.list],
    queryFn,
    ...options,
  };
}

export function getMeetingScheduleByIdAndCurrentStudentUser(
  keys: { id: number; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<MeetingSchedule, Error, MeetingSchedule, any>,
    'queryFn'
  >,
) {
  const { id, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${id}/students`;
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
