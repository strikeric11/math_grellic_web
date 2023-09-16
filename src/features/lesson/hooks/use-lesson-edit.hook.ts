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
} from '../api/teacher-lesson.api';

import type { Lesson, LessonUpsertFormData } from '../models/lesson.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  lessonFormData: LessonUpsertFormData | undefined;
  editLesson: (slug: string, data: LessonUpsertFormData) => Promise<Lesson>;
};

export function useLessonEdit(slug?: string): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync } = useMutation(
    editLessonApi({
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

  const editLesson = useCallback(
    async (slug: string, data: LessonUpsertFormData) => {
      const scheduleId = lesson?.schedules?.length
        ? lesson?.schedules[0]?.id
        : undefined;

      const updatedLesson = await mutateAsync({ slug, data, scheduleId });
      return updatedLesson;
    },
    [mutateAsync, lesson],
  );

  return { isDone, setIsDone, lessonFormData, editLesson };
}
