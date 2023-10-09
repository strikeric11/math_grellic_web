import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { queryClient } from '#/config/react-query-client.config';
import { queryExamKey } from '#/config/react-query-keys.config';
import {
  editExamSchedule as editScheduleApi,
  deleteExamSchedule as deleteExamScheduleApi,
} from '../api/teacher-exam-schedule.api';

import type { ExamSchedule } from '../models/exam.model';
import type { ExamScheduleUpsertFormData } from '../models/exam-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  editExamSchedule: (
    data: ExamScheduleUpsertFormData,
  ) => Promise<ExamSchedule | null>;
  deleteExamSchedule: () => Promise<boolean>;
};

export function useExamScheduleEdit(id?: number): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: editSchedule, isLoading } = useMutation(
    editScheduleApi({
      onSuccess: () =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryExamKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: queryExamKey.single,
          }),
        ]),
    }),
  );

  const { mutateAsync: mutateDeleteExamSchedule, isLoading: isDeleteLoading } =
    useMutation(
      deleteExamScheduleApi({
        onSuccess: () =>
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: queryExamKey.list,
            }),
            queryClient.invalidateQueries({
              queryKey: queryExamKey.single,
            }),
          ]),
      }),
    );

  const editExamSchedule = useCallback(
    async (data: ExamScheduleUpsertFormData) => {
      if (!id) {
        toast.error('Exam schedule is invalid');
        return null;
      }

      const updatedExamSchedule = await editSchedule({ id, data });
      return updatedExamSchedule;
    },
    [id, editSchedule],
  );

  const deleteExamSchedule = useCallback(async () => {
    if (!id) {
      return false;
    }

    return mutateDeleteExamSchedule(id);
  }, [id, mutateDeleteExamSchedule]);

  return {
    loading: isLoading || isDeleteLoading,
    isDone,
    setIsDone,
    editExamSchedule,
    deleteExamSchedule,
  };
}
