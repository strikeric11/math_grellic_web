import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { queryClient } from '#/config/react-query-client.config';
import { queryLessonKey } from '#/config/react-query-keys.config';
import {
  createLessonSchedule as createLessonScheduleApi,
  editLessonSchedule as editScheduleApi,
} from '../api/teacher-lesson-schedule.api';

import type { LessonSchedule } from '../models/lesson.model';
import type { LessonScheduleUpsertFormData } from '../models/lesson-form-data.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createLessonSchedule: (
    data: LessonScheduleUpsertFormData,
  ) => Promise<LessonSchedule>;
  editLessonSchedule: (
    data: LessonScheduleUpsertFormData,
  ) => Promise<LessonSchedule | null>;
};

export function useLessonScheduleUpsert(id?: number): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: createLessonSchedule } = useMutation(
    createLessonScheduleApi({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryLessonKey.list,
        });
        queryClient.invalidateQueries({
          queryKey: queryLessonKey.single,
        });
      },
    }),
  );

  const { mutateAsync: editSchedule } = useMutation(
    editScheduleApi({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryLessonKey.list,
        });
        queryClient.invalidateQueries({
          queryKey: queryLessonKey.single,
        });
      },
    }),
  );

  const editLessonSchedule = useCallback(
    async (data: LessonScheduleUpsertFormData) => {
      if (!id) {
        toast.error('Lesson schedule is invalid');
        return null;
      }

      const updatedLessonSchedule = await editSchedule({ id, data });
      return updatedLessonSchedule;
    },
    [id, editSchedule],
  );

  return { isDone, setIsDone, createLessonSchedule, editLessonSchedule };
}
