import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryLessonKey } from '#/config/react-query-keys.config';
import { transformToLesson } from '../helpers/lesson-transform.helper';
import {
  getLessonBySlugAndCurrentStudentUser,
  setLessonCompletion as setLessonCompletionApi,
} from '../api/student-lesson.api';

import type { Lesson, LessonCompletion } from '../models/lesson.model';

type Result = {
  loading: boolean;
  title: string;
  upcoming: boolean;
  lesson: Lesson | null;
  setLessonCompletion: (
    isCompleted: boolean,
  ) => Promise<LessonCompletion | null>;
};

export function useStudentLessonSingle(): Result {
  const { slug } = useParams();

  const {
    data: lesson,
    isLoading,
    isFetching,
  } = useQuery(
    getLessonBySlugAndCurrentStudentUser(
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

  const { mutateAsync, isLoading: isMutateLoading } = useMutation(
    setLessonCompletionApi({
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

  const title = useMemo(() => lesson?.title || '', [lesson]);
  const upcoming = useMemo(() => !!(lesson && !lesson.videoUrl), [lesson]);

  const setLessonCompletion = useCallback(
    (isCompleted: boolean) => mutateAsync({ slug: slug || '', isCompleted }),
    [slug, mutateAsync],
  );

  return {
    loading: isLoading || isFetching || isMutateLoading,
    title,
    upcoming,
    lesson: lesson || null,
    setLessonCompletion,
  };
}
