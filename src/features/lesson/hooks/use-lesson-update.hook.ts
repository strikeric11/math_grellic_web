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
  updateLesson as updateLessonApi,
} from '../api/lesson-teacher.api';

import type { Lesson, LessonUpsertFormData } from '../models/lesson.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  lessonFormData: LessonUpsertFormData | undefined;
  updateLesson: (slug: string, data: LessonUpsertFormData) => Promise<Lesson>;
};

export function useLessonUpdate(slug?: string): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync } = useMutation(
    updateLessonApi({
      onSuccess: (data: any) =>
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

  const { data: lesson } = useQuery(
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

  const updateLesson = useCallback(
    async (slug: string, data: LessonUpsertFormData) => {
      const scheduleId = lesson?.schedules?.length
        ? lesson?.schedules[0]?.id
        : undefined;

      const updatedLesson = await mutateAsync({ slug, data, scheduleId });

      return updatedLesson;
    },
    [mutateAsync, lesson],
  );

  return { isDone, setIsDone, lessonFormData, updateLesson };
}
