import { defer } from 'react-router-dom';

import { DAYS_PER_WEEK } from '#/utils/time.util';
import {
  getMeetingScheduleByIdAndCurrentStudentUser,
  getMeetingSchedulesByCurrentStudentUser,
  getSchedulesByDateRangeAndCurrentStudentUser,
} from '../api/student-schedule.api';

import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export function getMeetingScheduleByIdLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.id || !+params.id) {
      return;
    }

    const keys = { ...queryParams, id: +params.id };
    const query = getMeetingScheduleByIdAndCurrentStudentUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getMeetingSchedulesLoader(queryClient: QueryClient) {
  return async () => {
    const query = getMeetingSchedulesByCurrentStudentUser();
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
    const query = getSchedulesByDateRangeAndCurrentStudentUser({ from, to });
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
