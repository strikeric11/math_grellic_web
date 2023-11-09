import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { transformToMeetingSchedule } from '../helpers/schedule-transform.helper';
import { getMeetingSchedulesByCurrentStudentUser } from '../api/student-schedule.api';

import type { QueryObserverBaseResult } from '@tanstack/react-query';
import type {
  MeetingSchedule,
  StudentMeetingScheduleList,
} from '../models/schedule.model';

type Result = {
  upcomingMeetingSchedules: MeetingSchedule[];
  currentMeetingSchedules: MeetingSchedule[];
  previousMeetingSchedules: MeetingSchedule[];
  loading: boolean;
  refetch: QueryObserverBaseResult['refetch'];
};

export function useStudentMeetingScheduleList(): Result {
  const {
    data: list,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery(
    getMeetingSchedulesByCurrentStudentUser({
      refetchOnWindowFocus: false,
      select: (data: any) => {
        const {
          upcomingMeetingSchedules,
          currentMeetingSchedules,
          previousMeetingSchedules,
        } = data;
        const transformedUpcomingMeetingSchedules =
          upcomingMeetingSchedules?.length
            ? upcomingMeetingSchedules.map((item: any) =>
                transformToMeetingSchedule(item),
              )
            : [];

        const transformedCurrentMeetingSchedules =
          currentMeetingSchedules?.length
            ? currentMeetingSchedules.map((item: any) =>
                transformToMeetingSchedule(item),
              )
            : [];

        const transformedPreviousMeetingSchedules =
          previousMeetingSchedules?.length
            ? previousMeetingSchedules.map((item: any) =>
                transformToMeetingSchedule(item),
              )
            : [];

        return {
          upcomingMeetingSchedules: transformedUpcomingMeetingSchedules,
          currentMeetingSchedules: transformedCurrentMeetingSchedules,
          previousMeetingSchedules: transformedPreviousMeetingSchedules,
        };
      },
    }),
  );

  const {
    upcomingMeetingSchedules,
    currentMeetingSchedules,
    previousMeetingSchedules,
  } = useMemo(
    () =>
      (list || {
        upcomingMeetingSchedules: [],
        currentMeetingSchedules: [],
        previousMeetingSchedules: [],
      }) as StudentMeetingScheduleList,
    [list],
  );

  return {
    loading: isLoading || isRefetching,
    upcomingMeetingSchedules,
    currentMeetingSchedules,
    previousMeetingSchedules,
    refetch,
  };
}
