import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { transformToMeetingSchedule } from '../helpers/schedule-transform.helper';
import { getMeetingScheduleByIdAndCurrentStudentUser } from '../api/student-schedule.api';

import type { MeetingSchedule } from '../models/schedule.model';

type Result = {
  loading: boolean;
  title: string;
  meetingSchedule: MeetingSchedule | null;
};

export function useStudentMeetingScheduleSingle(): Result {
  const { id } = useParams();

  const {
    data: meetingSchedule,
    isLoading,
    isFetching,
  } = useQuery(
    getMeetingScheduleByIdAndCurrentStudentUser(
      { id: +(id || 0) },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToMeetingSchedule(data);
        },
      },
    ),
  );

  const title = useMemo(() => meetingSchedule?.title || '', [meetingSchedule]);

  return {
    loading: isLoading || isFetching,
    title,
    meetingSchedule: meetingSchedule || null,
  };
}
