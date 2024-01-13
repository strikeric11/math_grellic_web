import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import dayjs from '#/config/dayjs.config';
import { getDateTimeNow } from '#/core/api/core.api';
import { transformToTimelineSchedules } from '../helpers/schedule-transform.helper';
import { getSchedulesByDateAndCurrentStudentUser } from '../api/student-schedule.api';

import type { ExamSchedule } from '#/exam/models/exam.model';
import type { LessonSchedule } from '#/lesson/models/lesson.model';
import type { MeetingSchedule } from '../models/schedule.model';

type Result = {
  loading: boolean;
  schedules: (LessonSchedule | ExamSchedule | MeetingSchedule)[];
  refresh: () => void;
};

export function useStudentScheduleTodayList(): Result {
  const {
    data: today,
    isLoading: isTodayLoading,
    isRefetching: isTodayRefetching,
    refetch: refreshToday,
  } = useQuery(
    getDateTimeNow({
      refetchOnWindowFocus: false,
      initialData: null,
      select: (data: any) => (data ? dayjs(data).toDate() : null),
    }),
  );

  const {
    data: timelineSchedules,
    isLoading: isTimelineSchedulesLoading,
    isRefetching: isTimelineSchedulesRefetching,
    refetch: refreshTimelineSchedules,
  } = useQuery(
    getSchedulesByDateAndCurrentStudentUser(today || new Date(), {
      enabled: !!today,
      refetchOnWindowFocus: false,
      select: (data: any) => transformToTimelineSchedules(data),
    }),
  );

  const schedules = useMemo(() => {
    const { lessonSchedules, examSchedules, meetingSchedules } =
      timelineSchedules || {};

    return [
      ...(lessonSchedules || []),
      ...(examSchedules || []),
      ...(meetingSchedules || []),
    ]
      .filter((schedule) => !!schedule)
      .sort(
        (scheduleA, scheduleB) =>
          scheduleA.startDate.valueOf() - scheduleB.startDate.valueOf(),
      );
  }, [timelineSchedules]);

  const refresh = useCallback(() => {
    refreshToday();
    refreshTimelineSchedules();
  }, [refreshToday, refreshTimelineSchedules]);

  return {
    loading:
      isTodayLoading ||
      isTodayRefetching ||
      isTimelineSchedulesLoading ||
      isTimelineSchedulesRefetching,
    schedules,
    refresh,
  };
}
