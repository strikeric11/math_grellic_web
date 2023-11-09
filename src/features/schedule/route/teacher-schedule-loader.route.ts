import { defer } from 'react-router-dom';

import { DAYS_PER_WEEK } from '#/utils/time.util';
import {
  getSchedulesByDateRangeAndCurrentTeacherUser,
  getMeetingScheduleByIdAndCurrentTeacherUser,
  getPaginatedMeetingSchedulesByCurrentTeacherUser,
} from '../api/teacher-schedule.api';
import { defaultParamKeys } from '../hooks/use-teacher-meeting-schedule-list.hook';

import type { LoaderFunctionArgs } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';

export function getMeetingScheduleByIdLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.id || !+params.id) {
      return;
    }

    const keys = { ...queryParams, id: +params.id };
    const query = getMeetingScheduleByIdAndCurrentTeacherUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getPaginatedMeetingSchedulesLoader(queryClient: QueryClient) {
  return async () => {
    const query =
      getPaginatedMeetingSchedulesByCurrentTeacherUser(defaultParamKeys);
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getSchedulesByDateRangeLoader(queryClient: QueryClient) {
  const today = new Date();
  const first = today.getDate() - today.getDay() + 1;
  const last = first + (DAYS_PER_WEEK - 1);

  const from = new Date(today.setDate(first));
  const to = new Date(today.setDate(last));

  return async () => {
    const query = getSchedulesByDateRangeAndCurrentTeacherUser({ from, to });
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
