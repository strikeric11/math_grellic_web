import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import dayjs from '#/config/dayjs.config';
import { DAYS_PER_WEEK } from '#/utils/time.util';
import { transformToTimelineSchedules } from '../helpers/schedule-transform.helper';
import { getSchedulesByDateRangeAndCurrentStudentUser } from '../api/student-schedule.api';

import type { TimelineSchedules } from '../models/schedule.model';

type Result = {
  loading: boolean;
  currentDate: Date | null;
  setCurrentDate: (date: Date) => void;
  timelineSchedules?: TimelineSchedules;
};

export function useStudentScheduleMonthlyCalendar(today: Date | null): Result {
  const [currentDate, setCurrentDate] = useState<Date | null>(today);

  const [from, to] = useMemo(() => {
    const target = dayjs(currentDate);

    return [
      target.set('date', 1).weekday(0).toDate(),
      target
        .set('date', target.daysInMonth())
        .weekday(DAYS_PER_WEEK - 1)
        .toDate(),
    ];
  }, [currentDate]);

  const {
    data: timelineSchedules,
    isLoading,
    isRefetching,
  } = useQuery(
    getSchedulesByDateRangeAndCurrentStudentUser(
      { from, to },
      {
        refetchOnWindowFocus: false,
        select: (data: any) => transformToTimelineSchedules(data),
      },
    ),
  );

  return {
    loading: isLoading || isRefetching,
    currentDate,
    setCurrentDate,
    timelineSchedules,
  };
}
