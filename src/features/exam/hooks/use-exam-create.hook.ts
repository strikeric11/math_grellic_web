import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryExamKey } from '#/config/react-query-keys.config';
import {
  createExam as createExamApi,
  validateUpsertExam as validateUpsertExamApi,
  uploadExamImages as uploadExamImagesApi,
} from '../api/teacher-exam.api';

import type { Exam } from '../models/exam.model';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createExam: (data: ExamUpsertFormData) => Promise<Exam>;
  loading?: boolean;
};

export function useExamCreate(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: validateUpsertExam, isLoading: isValidateExamLoading } =
    useMutation(validateUpsertExamApi());

  const {
    mutateAsync: mutateUploadExamImages,
    isLoading: isUploadImagesLoading,
  } = useMutation(uploadExamImagesApi());

  const { mutateAsync: mutateCreateExam, isLoading: isCreateExamLoading } =
    useMutation(
      createExamApi({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: queryExamKey.list,
          });
        },
      }),
    );

  const createExam = useCallback(
    async (data: ExamUpsertFormData) => {
      const hasImages = data.questions.some(
        (question) =>
          !!question.imageData ||
          question.choices.some((choice) => !!choice.imageData),
      );

      if (!hasImages) {
        return mutateCreateExam(data);
      }

      await validateUpsertExam({ data });
      const images = await mutateUploadExamImages({ data });
      // Clone value for shifting of array
      const clonedImages = images;
      // Apply image url to question/choice text for exam creation
      const transformedFormData: ExamUpsertFormData = {
        ...data,
        questions: data.questions.map((question) => {
          const text = question.imageData
            ? clonedImages.shift() || ''
            : question.text;

          const choices = question.choices.map((choice) => ({
            ...choice,
            text: choice.imageData ? clonedImages.shift() || '' : choice.text,
          }));

          return {
            ...question,
            text,
            choices,
          };
        }),
      };

      return mutateCreateExam(transformedFormData);
    },
    [validateUpsertExam, mutateCreateExam, mutateUploadExamImages],
  );

  return {
    loading:
      isValidateExamLoading || isCreateExamLoading || isUploadImagesLoading,
    isDone,
    setIsDone,
    createExam,
  };
}
