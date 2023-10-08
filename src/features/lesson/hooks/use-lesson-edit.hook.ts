import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryLessonKey } from '#/config/react-query-keys.config';
import { queryClient } from '#/config/react-query-client.config';
import {
  transformToLesson,
  transformToLessonFormData,
} from '../helpers/lesson-transform.helper';
import {
  getLessonBySlugAndCurrentTeacherUser,
  editLesson as editLessonApi,
  deleteLesson as deleteLessonApi,
} from '../api/teacher-lesson.api';

import type { Lesson } from '../models/lesson.model';
import type { LessonUpsertFormData } from '../models/lesson-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  lessonFormData: LessonUpsertFormData | undefined;
  editLesson: (data: LessonUpsertFormData) => Promise<Lesson>;
  deleteLesson: () => Promise<boolean>;
};

export function useLessonEdit(slug?: string): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateEditLesson, isLoading } = useMutation(
    editLessonApi({
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryLessonKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: [...queryLessonKey.single, { slug: data?.slug }],
          }),
        ]),
    }),
  );

  const { mutateAsync: mutateDeleteLesson, isLoading: isDeleteLoading } =
    useMutation(
      deleteLessonApi({
        onSuccess: () =>
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: queryLessonKey.list,
            }),
            queryClient.invalidateQueries({
              queryKey: [...queryLessonKey.single, { slug }],
            }),
          ]),
      }),
    );

  const {
    data: lesson,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getLessonBySlugAndCurrentTeacherUser(
      { slug: slug || '' },
      {
        enabled: !!slug,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToLesson(data);
        },
      },
    ),
  );

  const lessonFormData = useMemo(
    () => (lesson ? transformToLessonFormData(lesson) : undefined),
    [lesson],
  );

  const editLesson = useCallback(
    async (data: LessonUpsertFormData) => {
      const scheduleId = lesson?.schedules?.length
        ? lesson?.schedules[0]?.id
        : undefined;

      const updatedLesson = await mutateEditLesson({
        slug: slug || '',
        data,
        scheduleId,
      });
      return updatedLesson;
    },
    [slug, lesson, mutateEditLesson],
  );

  const deleteLesson = useCallback(async () => {
    if (!slug?.trim()) {
      return false;
    }

    return mutateDeleteLesson(slug);
  }, [slug, mutateDeleteLesson]);

  return {
    loading: isLoading || isDeleteLoading || isQueryLoading || isQueryFetching,
    isDone,
    setIsDone,
    lessonFormData,
    editLesson,
    deleteLesson,
  };
}
