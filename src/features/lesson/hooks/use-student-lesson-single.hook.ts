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
  isUpcoming: boolean;
  lesson: Lesson | null;
  upcomingDayJsDuration: Duration | null;
  setLessonCompletion: (
    isCompleted: boolean,
  ) => Promise<LessonCompletion | null>;
};

export function useStudentLessonSingle(): Result {
  const { serverClock, startClock, stopClock } = useClockSocket();
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

  const [title, isUpcoming] = useMemo(
    () => [lesson?.title || '', !!(lesson && !lesson.videoUrl)],
    [lesson],
  );

  const upcomingDayJsDuration = useMemo(() => {
    if (!isUpcoming || !lesson?.schedules?.length) {
      return null;
    }
    return getDayJsDuration(lesson.schedules[0].startDate, serverClock);
  }, [isUpcoming, lesson, serverClock]);

  const setLessonCompletion = useCallback(
    (isCompleted: boolean) => mutateAsync({ slug: slug || '', isCompleted }),
    [slug, mutateAsync],
  );

  // Stop clock ticking if current lesson is already available
  useEffect(() => {
    if (!lesson) {
      return;
    }

    isUpcoming ? startClock() : stopClock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpcoming, lesson]);

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
    isUpcoming,
    lesson: lesson || null,
    upcomingDayJsDuration,
    setLessonCompletion,
  };
}
