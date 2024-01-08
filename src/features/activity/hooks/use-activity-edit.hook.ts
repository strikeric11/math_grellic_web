import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import isBase64 from 'validator/lib/isBase64';

import { queryClient } from '#/config/react-query-client.config';
import { queryActivityKey } from '#/config/react-query-keys.config';
import {
  transformToActivity,
  transformToActivityFormData,
} from '../helpers/activity-transform.helper';
import {
  getActivityBySlugAndCurrentTeacherUser,
  editActivity as editActivityApi,
  deleteActivity as deleteActivityApi,
  uploadActivityImages as uploadActivityImagesApi,
  validateUpsertActivity as validateUpsertActivityApi,
} from '../api/teacher-activity.api';

import { ActivityCategoryType, type Activity } from '../models/activity.model';
import type { ActivityUpsertFormData } from '../models/activity-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  activityFormData: ActivityUpsertFormData | undefined;
  editActivity: (data: ActivityUpsertFormData) => Promise<Activity>;
  deleteActivity: () => Promise<boolean>;
};

export function useActivityEdit(slug?: string): Result {
  const [isDone, setIsDone] = useState(false);

  const {
    mutateAsync: validateUpsertActivity,
    isLoading: isValidateActivityLoading,
  } = useMutation(validateUpsertActivityApi());

  const {
    mutateAsync: mutateUploadActivityImages,
    isLoading: isUploadImagesLoading,
  } = useMutation(uploadActivityImagesApi());

  const { mutateAsync: mutateEditActivity, isLoading } = useMutation(
    editActivityApi({
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryActivityKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: [...queryActivityKey.single, { slug: data?.slug }],
          }),
        ]),
    }),
  );

  const { mutateAsync: mutateDeleteActivity, isLoading: isDeleteLoading } =
    useMutation(
      deleteActivityApi({
        onSuccess: () =>
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: queryActivityKey.list,
            }),
            queryClient.invalidateQueries({
              queryKey: [...queryActivityKey.single, { slug }],
            }),
          ]),
      }),
    );

  const {
    data: activity,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getActivityBySlugAndCurrentTeacherUser(
      { slug: slug || '' },
      {
        enabled: !!slug,
        refetchOnWindowFocus: false,
        select: (data: any) => transformToActivity(data),
      },
    ),
  );

  const activityFormData = useMemo(
    () => (activity ? transformToActivityFormData(activity) : undefined),
    [activity],
  );

  const editActivity = useCallback(
    async (data: ActivityUpsertFormData) => {
      const isStage = data.game.type === ActivityCategoryType.Stage;

      const hasImages = data.categories.some((category) => {
        if (isStage) {
          return category.stageQuestions?.some((sq) =>
            sq.questions.some(
              (question) =>
                (question.imageData &&
                  isBase64(question.imageData?.split(',').pop() || '')) ||
                question.choices.some(
                  (choice) =>
                    choice.imageData &&
                    isBase64(choice.imageData?.split(',').pop() || ''),
                ),
            ),
          );
        }

        return category.questions?.some(
          (question) =>
            (question.imageData &&
              isBase64(question.imageData?.split(',').pop() || '')) ||
            question.choices.some(
              (choice) =>
                choice.imageData &&
                isBase64(choice.imageData?.split(',').pop() || ''),
            ),
        );
      });
      // If no images then proceed to update activity
      if (!hasImages) {
        return mutateEditActivity({ slug: slug || '', data });
      }

      await validateUpsertActivity({ data, slug });
      const images = await mutateUploadActivityImages({ data, strict: true });
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
              }),
            );

            return {
              ...category,
              stageQuestions,
            };
          }

          const questions = category.questions?.map((question) => {
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
          });

          return {
            ...category,
            questions,
          };
        }),
      };

      return mutateEditActivity({
        slug: slug || '',
        data: transformedFormData,
      });
    },
    [
      slug,
      validateUpsertActivity,
      mutateUploadActivityImages,
      mutateEditActivity,
    ],
  );

  const deleteActivity = useCallback(async () => {
    if (!slug?.trim()) {
      return false;
    }

    return mutateDeleteActivity(slug);
  }, [slug, mutateDeleteActivity]);

  return {
    loading:
      isLoading ||
      isDeleteLoading ||
      isQueryLoading ||
      isQueryFetching ||
      isValidateActivityLoading ||
      isUploadImagesLoading,
    isDone,
    setIsDone,
    activityFormData,
    editActivity,
    deleteActivity,
  };
}
