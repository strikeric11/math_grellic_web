import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryExamKey } from '#/config/react-query-keys.config';
import { createExamSchedule as createExamScheduleApi } from '../api/teacher-exam-schedule.api';

import type { ExamSchedule } from '../models/exam.model';
import type { ExamScheduleUpsertFormData } from '../models/exam-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createExamSchedule: (
    data: ExamScheduleUpsertFormData,
  ) => Promise<ExamSchedule>;
};

export function useExamScheduleCreate(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: createExamSchedule, isLoading } = useMutation(
    createExamScheduleApi({
      onSuccess: () =>
        Promise.all([
          (queryClient.invalidateQueries({
            queryKey: queryExamKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: queryExamKey.single,
          })),
        ]),
    }),
  );

  return { loading: isLoading, isDone, setIsDone, createExamSchedule };
}
