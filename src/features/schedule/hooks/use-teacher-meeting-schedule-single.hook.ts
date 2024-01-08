import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { queryUserKey } from '#/config/react-query-keys.config';
import { transformToStudentUserAccount } from '#/user/helpers/user-transform.helper';
import { getStudentsByCurrentTeacherUser } from '#/user/api/teacher-user.api';
import { transformToMeetingSchedule } from '../helpers/schedule-transform.helper';
import { getMeetingScheduleByIdAndCurrentTeacherUser } from '../api/teacher-schedule.api';

import type { MeetingSchedule } from '../models/schedule.model';

type Result = {
  loading: boolean;
  meetingSchedule?: MeetingSchedule | null;
};

export function useTeacherMeetingScheduleSingle(): Result {
  const { id } = useParams();

  const { data, isLoading, isFetching } = useQuery(
    getMeetingScheduleByIdAndCurrentTeacherUser(
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

  const {
    data: selectedStudents,
    isLoading: isSelectStudentsLoading,
    isFetching: isSelectStudentsFetching,
  } = useQuery(
    getStudentsByCurrentTeacherUser(
      { ids: data?.students?.map((s) => s.id) || [] },
      {
        queryKey: queryUserKey.selectedStudentList,
        refetchOnWindowFocus: false,
        initialData: [],
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToStudentUserAccount(item))
            : [],
      },
    ),
  );

  const meetingSchedule = useMemo(() => {
    if (!selectedStudents?.length) {
      return data;
    }

    return data ? { ...data, students: selectedStudents } : undefined;
  }, [data, selectedStudents]);

  return {
    loading:
      isLoading ||
      isFetching ||
      isSelectStudentsLoading ||
      isSelectStudentsFetching,
    meetingSchedule,
  };
}
