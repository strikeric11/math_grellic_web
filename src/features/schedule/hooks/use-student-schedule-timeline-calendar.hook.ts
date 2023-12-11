import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import dayjs from '#/config/dayjs.config';
import { DAYS_PER_WEEK } from '#/utils/time.util';
import { getDateTimeNow } from '#/core/api/core.api';
import { transformToTimelineSchedules } from '../helpers/schedule-transform.helper';
import { getSchedulesByDateRangeAndCurrentStudentUser } from '../api/student-schedule.api';

import type { TimelineSchedules } from '../models/schedule.model';

type Result = {
  loading: boolean;
  today: Date | null;
  weekIndex: number;
  handleWeekChange: (valueToAdd: number) => void;
  refresh: () => void;
  timelineSchedules?: TimelineSchedules;
};

export function useStudentScheduleTimelineCalendar(): Result {
  const [weekIndex, setWeekIndex] = useState(0);

  const [from, to] = useMemo(() => {
    const value = DAYS_PER_WEEK * weekIndex;
    return [
      dayjs().weekday(value).toDate(),
      dayjs()
        .weekday(DAYS_PER_WEEK - 1 + value)
        .toDate(),
    ];
  }, [weekIndex]);

  const {
    data: today,
    isLoading: isTodayLoading,
    isRefetching: isTodayRefetching,
  } = useQuery(
    getDateTimeNow({
      refetchOnWindowFocus: false,
      initialData: null,
      select: (data: any) => (data ? dayjs(data).toDate() : null),
    }),
  );

  const {
    data: timelineSchedules,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery(
    getSchedulesByDateRangeAndCurrentStudentUser(
      { from, to },
      {
        refetchOnWindowFocus: false,
        select: (data: any) => transformToTimelineSchedules(data),
      },
    ),
  );

  const handleWeekChange = useCallback((valueToAdd: number) => {
    setWeekIndex((prev) => prev + valueToAdd);
  }, []);

  const refresh = useCallback(() => {
    setWeekIndex(0);
    refetch();
  }, [refetch]);

  return {
    loading: isTodayLoading || isTodayRefetching || isLoading || isRefetching,
    timelineSchedules,
    today: today as Date | null,
    weekIndex,
    handleWeekChange,
    refresh,
  };
}
