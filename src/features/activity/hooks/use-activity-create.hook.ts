import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryActivityKey } from '#/config/react-query-keys.config';
import { ActivityCategoryType } from '../models/activity.model';
import {
  createActivity as createActivityApi,
  validateUpsertActivity as validateUpsertActivityApi,
  uploadActivityImages as uploadActivityImagesApi,
} from '../api/teacher-activity.api';

import type { ActivityUpsertFormData } from '../models/activity-form-data.model';
import type { Activity } from '../models/activity.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createActivity: (data: ActivityUpsertFormData) => Promise<Activity>;
  loading?: boolean;
};

export function useActivityCreate(): Result {
  const [isDone, setIsDone] = useState(false);

  const {
    mutateAsync: validateUpsertActivity,
    isLoading: isValidateActivityLoading,
  } = useMutation(validateUpsertActivityApi());

  const {
    mutateAsync: mutateUploadActivityImages,
    isLoading: isUploadImagesLoading,
  } = useMutation(uploadActivityImagesApi());

  const {
    mutateAsync: mutateCreateActivity,
    isLoading: isCreateActivityLoading,
  } = useMutation(
    createActivityApi({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryActivityKey.list,
        });
      },
    }),
  );

  const createActivity = useCallback(
    async (data: ActivityUpsertFormData) => {
      const isStage = data.game.type === ActivityCategoryType.Stage;

      const hasImages = data.categories.some((category) => {
        if (isStage) {
          return category.stageQuestions?.some((sq) =>
            sq.questions.some(
              (question) =>
                !!question.imageData ||
                question.choices.some((choice) => !!choice.imageData),
            ),
          );
        }

        return category.questions?.some(
          (question) =>
            !!question.imageData ||
            question.choices.some((choice) => !!choice.imageData),
        );
      });

      if (!hasImages) {
        return mutateCreateActivity(data);
      }

      await validateUpsertActivity({ data });
      const images = await mutateUploadActivityImages({ data });
      // Clone value for shifting of array
      const clonedImages = images;
      // Apply image url to question/choice text for activity creation
      const transformedFormData: ActivityUpsertFormData = {
        ...data,
        categories: data.categories.map((category) => {
          if (isStage) {
            const stageQuestions = category.stageQuestions?.map(
              ({ questions }) => ({
                questions: questions.map((question) => {
                  const text = question.imageData
                    ? clonedImages.shift() || ''
                    : question.text;

                  const choices = question.choices.map((choice) => ({
                    ...choice,
                    text: choice.imageData
                      ? clonedImages.shift() || ''
                      : choice.text,
                  }));

                  return {
                    ...question,
                    text,
                    choices,
                  };
                }),
              }),
            );

            return {
              ...category,
              stageQuestions,
            };
          }

          const questions = category.questions?.map((question) => {
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
          });

          return {
            ...category,
            questions,
          };
        }),
      };

      return mutateCreateActivity(transformedFormData);
    },
    [validateUpsertActivity, mutateCreateActivity, mutateUploadActivityImages],
  );

  return {
    loading:
      isValidateActivityLoading ||
      isCreateActivityLoading ||
      isUploadImagesLoading,
    isDone,
    setIsDone,
    createActivity,
  };
}
