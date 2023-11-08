import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryScheduleKey } from '#/config/react-query-keys.config';
import { createMeetingSchedule as createMeetingScheduleApi } from '../api/teacher-schedule.api';

import type { MeetingSchedule } from '../models/schedule.model';
import type { MeetingScheduleUpsertFormData } from '../models/schedule-form-data.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createMeetingSchedule: (
    data: MeetingScheduleUpsertFormData,
  ) => Promise<MeetingSchedule>;
};

export function useMeetingScheduleCreate(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: createMeetingSchedule } = useMutation(
    createMeetingScheduleApi({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryScheduleKey.timeline,
        });
      },
    }),
  );

  return { isDone, setIsDone, createMeetingSchedule };
}
