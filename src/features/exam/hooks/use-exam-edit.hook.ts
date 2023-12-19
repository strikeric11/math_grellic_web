import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import isBase64 from 'validator/lib/isBase64';

import { queryClient } from '#/config/react-query-client.config';
import { queryExamKey } from '#/config/react-query-keys.config';
import {
  transformToExam,
  transformToExamFormData,
} from '../helpers/exam-transform.helper';
import {
  getExamBySlugAndCurrentTeacherUser,
  validateUpsertExam as validateUpsertExamApi,
  uploadExamImages as uploadExamImagesApi,
  editExam as editExamApi,
  deleteExam as deleteExamApi,
} from '../api/teacher-exam.api';

import type { Exam } from '../models/exam.model';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

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

  const { mutateAsync: validateUpsertExam, isLoading: isValidateExamLoading } =
    useMutation(validateUpsertExamApi());

  const {
    mutateAsync: mutateUploadExamImages,
    isLoading: isUploadImagesLoading,
  } = useMutation(uploadExamImagesApi());

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
      // Set schedule id
      const scheduleId = exam?.schedules?.length
        ? exam?.schedules[0]?.id
        : undefined;
      // Check is question/choices has new images
      const hasImages = data.questions.some(
        (question) =>
          (question.imageData &&
            isBase64(question.imageData?.split(',').pop() || '')) ||
          question.choices.some(
            (choice) =>
              choice.imageData &&
              isBase64(choice.imageData?.split(',').pop() || ''),
          ),
      );
      // If no images then proceed to update exam
      if (!hasImages) {
        return mutateEditExam({ slug: slug || '', data, scheduleId });
      }

      await validateUpsertExam({ data, slug, scheduleId });
      const images = await mutateUploadExamImages({ data, strict: true });
      // Clone value for shifting of array
      const clonedImages = images;
      // Apply image url to question/choice text for exam creation
      const transformedFormData: ExamUpsertFormData = {
        ...data,
        questions: data.questions.map((question) => {
          const text =
            question.imageData &&
            isBase64(question.imageData?.split(',').pop() || '')
              ? clonedImages.shift() || ''
              : question.text;

          const choices = question.choices.map((choice) => ({
            ...choice,
            text:
              choice.imageData &&
              isBase64(choice.imageData?.split(',').pop() || '')
                ? clonedImages.shift() || ''
                : choice.text,
          }));

          return {
            ...question,
            text,
            choices,
          };
        }),
      };

      return mutateEditExam({
        slug: slug || '',
        data: transformedFormData,
        scheduleId,
      });
    },
    [slug, exam, validateUpsertExam, mutateUploadExamImages, mutateEditExam],
  );

  const deleteExam = useCallback(async () => {
    if (!slug?.trim()) {
      return false;
    }

    return mutateDeleteExam(slug);
  }, [slug, mutateDeleteExam]);

  return {
    loading:
      isLoading ||
      isDeleteLoading ||
      isQueryLoading ||
      isQueryFetching ||
      isValidateExamLoading ||
      isUploadImagesLoading,
    isDone,
    setIsDone,
    examFormData,
    editExam,
    deleteExam,
  };
}
