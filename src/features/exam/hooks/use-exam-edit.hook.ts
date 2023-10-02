import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryExamKey } from '#/config/react-query-keys.config';
import {
  transformToExam,
  transformToExamFormData,
} from '../helpers/exam-transform.helper';
import {
  getExamBySlugAndCurrentTeacherUser,
  editExam as editExamApi,
  deleteExam as deleteExamApi,
} from '../api/teacher-exam.api';

import type { Exam, ExamUpsertFormData } from '../models/exam.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  examFormData: ExamUpsertFormData | undefined;
  editExam: (data: ExamUpsertFormData) => Promise<Exam>;
  deleteExam: () => Promise<boolean>;
};

export function useExamEdit(slug?: string): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateEditExam, isLoading } = useMutation(
    editExamApi({
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryExamKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: [...queryExamKey.single, { slug: data?.slug }],
          }),
        ]),
    }),
  );

  const { mutateAsync: mutateDeleteExam, isLoading: isDeleteLoading } =
    useMutation(
      deleteExamApi({
        onSuccess: () =>
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: queryExamKey.list,
            }),
            queryClient.invalidateQueries({
              queryKey: [...queryExamKey.single, { slug }],
            }),
          ]),
      }),
    );

  const {
    data: exam,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getExamBySlugAndCurrentTeacherUser(
      { slug: slug || '' },
      {
        enabled: !!slug,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToExam(data);
        },
      },
    ),
  );

  const examFormData = useMemo(
    () => (exam ? transformToExamFormData(exam) : undefined),
    [exam],
  );

  const editExam = useCallback(
    async (data: ExamUpsertFormData) => {
      const scheduleId = exam?.schedules?.length
        ? exam?.schedules[0]?.id
        : undefined;

      const updatedExam = await mutateEditExam({
        slug: slug || '',
        data,
        scheduleId,
      });
      return updatedExam;
    },
    [slug, exam, mutateEditExam],
  );

  const deleteExam = useCallback(async () => {
    if (!slug?.trim()) {
      return false;
    }

    return mutateDeleteExam(slug);
  }, [slug, mutateDeleteExam]);

  return {
    loading: isLoading || isDeleteLoading || isQueryLoading || isQueryFetching,
    isDone,
    setIsDone,
    examFormData,
    editExam,
    deleteExam,
  };
}
