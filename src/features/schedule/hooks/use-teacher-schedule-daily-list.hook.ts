import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import dayjs from '#/config/dayjs.config';
import { getDateTimeNow } from '#/core/api/core.api';
import { transformToTimelineSchedules } from '../helpers/schedule-transform.helper';
import { ScheduleType } from '../models/schedule.model';
import { getSchedulesByDateAndCurrentTeacherUser } from '../api/teacher-schedule.api';

import type { ExamSchedule } from '#/exam/models/exam.model';
import type { LessonSchedule } from '#/lesson/models/lesson.model';
import type { MeetingSchedule } from '../models/schedule.model';

type Result = {
  loading: boolean;
  schedules: (LessonSchedule | ExamSchedule | MeetingSchedule)[];
  today: Date | null;
  currentDate: Date | null;
  setCurrentDate: (date: Date) => void;
  refresh: () => void;
};

export function useTeacherScheduleDailyList(
  scheduleType?: ScheduleType,
): Result {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

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
    getSchedulesByDateAndCurrentTeacherUser(
      currentDate || today || new Date(),
      {
        enabled: !!currentDate || !!today,
        refetchOnWindowFocus: false,
        select: (data: any) => transformToTimelineSchedules(data),
      },
    ),
  );

  const schedules = useMemo(() => {
    const { lessonSchedules, examSchedules, meetingSchedules } =
      timelineSchedules || {};

    let list = [
      ...(lessonSchedules || []),
      ...(examSchedules || []),
      ...(meetingSchedules || []),
    ];

    switch (scheduleType) {
      case ScheduleType.Lesson:
        list = lessonSchedules || [];
        break;
      case ScheduleType.Exam:
        list = examSchedules || [];
        break;
      case ScheduleType.Meeting:
        list = meetingSchedules || [];
        break;
    }

    return list
      .filter((schedule) => !!schedule)
      .sort(
        (scheduleA, scheduleB) =>
          scheduleA.startDate.valueOf() - scheduleB.startDate.valueOf(),
      );
  }, [scheduleType, timelineSchedules]);

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
    today: today as Date | null,
    currentDate,
    schedules,
    setCurrentDate,
    refresh,
  };
}
