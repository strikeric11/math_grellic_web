import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryScheduleKey } from '#/config/react-query-keys.config';
import { queryClient } from '#/config/react-query-client.config';
import {
  transformToMeetingSchedule,
  transformToMeetingScheduleFormData,
} from '../helpers/schedule-transform.helper';
import {
  getMeetingScheduleByIdAndCurrentTeacherUser,
  editMeetingSchedule as editMeetingScheduleApi,
  deleteMeetingSchedule as deleteMeetingScheduleApi,
} from '../api/teacher-schedule.api';

import type { MeetingSchedule } from '../models/schedule.model';
import type { MeetingScheduleUpsertFormData } from '../models/schedule-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  meetingScheduleFormData: MeetingScheduleUpsertFormData | undefined;
  editMeetingSchedule: (
    data: MeetingScheduleUpsertFormData,
  ) => Promise<MeetingSchedule>;
  deleteMeetingSchedule: () => Promise<boolean>;
};

export function useMeetingScheduleEdit(id?: number): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateEditMeetingSchedule, isLoading } = useMutation(
    editMeetingScheduleApi({
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryScheduleKey.timeline,
          }),
          queryClient.invalidateQueries({
            queryKey: [...queryScheduleKey.single, { id: data?.id }],
          }),
        ]),
    }),
  );

  const {
    mutateAsync: mutateDeleteMeetingSchedule,
    isLoading: isDeleteLoading,
  } = useMutation(
    deleteMeetingScheduleApi({
      onSuccess: () =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryScheduleKey.timeline,
          }),
          queryClient.invalidateQueries({
            queryKey: [...queryScheduleKey.single, { id }],
          }),
        ]),
    }),
  );

  const {
    data: meetingSchedule,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getMeetingScheduleByIdAndCurrentTeacherUser(
      { id: id || 0 },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToMeetingSchedule(data);
        },
      },
    ),
  );

  const meetingScheduleFormData = useMemo(
    () =>
      meetingSchedule
        ? transformToMeetingScheduleFormData(meetingSchedule)
        : undefined,
    [meetingSchedule],
  );

  const editMeetingSchedule = useCallback(
    async (data: MeetingScheduleUpsertFormData) => {
      const updatedExam = await mutateEditMeetingSchedule({
        id: meetingSchedule?.id || 0,
        data,
      });
      return updatedExam;
    },
    [meetingSchedule, mutateEditMeetingSchedule],
  );

  const deleteMeetingSchedule = useCallback(async () => {
    if (!meetingSchedule?.id) {
      return false;
    }

    return mutateDeleteMeetingSchedule(meetingSchedule.id);
  }, [meetingSchedule, mutateDeleteMeetingSchedule]);

  return {
    loading: isLoading || isDeleteLoading || isQueryLoading || isQueryFetching,
    isDone,
    setIsDone,
    meetingScheduleFormData,
    editMeetingSchedule,
    deleteMeetingSchedule,
  };
}
