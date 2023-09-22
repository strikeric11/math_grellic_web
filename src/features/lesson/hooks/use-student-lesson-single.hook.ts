import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { getDayJsDuration } from '#/utils/time.util';
import { queryClient } from '#/config/react-query-client.config';
import { queryLessonKey } from '#/config/react-query-keys.config';
import { useClockSocket } from '#/core/hooks/use-clock-socket.hook';
import { transformToLesson } from '../helpers/lesson-transform.helper';
import {
  getLessonBySlugAndCurrentStudentUser,
  setLessonCompletion as setLessonCompletionApi,
} from '../api/student-lesson.api';

import type { Duration } from 'dayjs/plugin/duration';
import type { Lesson, LessonCompletion } from '../models/lesson.model';

type Result = {
  loading: boolean;
  title: string;
  upcoming: boolean;
  lesson: Lesson | null;
  upcomingDayJsDuration: Duration | null;
  setLessonCompletion: (
    isCompleted: boolean,
  ) => Promise<LessonCompletion | null>;
};

export function useStudentLessonSingle(): Result {
  const { serverClock, stopClock } = useClockSocket();
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

  const upcomingDayJsDuration = useMemo(() => {
    if (!upcoming || !lesson?.schedules?.length) {
      return null;
    }
    return getDayJsDuration(lesson.schedules[0].startDate, serverClock);
  }, [upcoming, lesson, serverClock]);

  const setLessonCompletion = useCallback(
    (isCompleted: boolean) => mutateAsync({ slug: slug || '', isCompleted }),
    [slug, mutateAsync],
  );

  // Stop clock ticking if current lesson is already available
  useEffect(() => {
    if (!lesson) {
      return;
    }

    if (!upcoming) {
      stopClock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upcoming, lesson]);

  useEffect(() => {
    if (!upcomingDayJsDuration || upcomingDayJsDuration.asSeconds() > 0) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: queryLessonKey.list });
    queryClient.invalidateQueries({
      queryKey: [...queryLessonKey.single, { slug }],
    });
  }, [slug, upcomingDayJsDuration]);

  return {
    loading: isLoading || isFetching || isMutateLoading,
    title,
    upcoming,
    lesson: lesson || null,
    upcomingDayJsDuration,
    setLessonCompletion,
  };
}
