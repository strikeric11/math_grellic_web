import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getDayJsDuration } from '#/utils/time.util';
import { queryClient } from '#/config/react-query-client.config';
import { queryLessonKey } from '#/config/react-query-keys.config';
import { useClockSocket } from '#/core/hooks/use-clock-socket.hook';
import { transformToLesson } from '../helpers/lesson-transform.helper';
import { getLessonsByCurrentStudentUser } from '../api/student-lesson.api';

import type { QueryObserverBaseResult } from '@tanstack/react-query';
import type { Duration } from 'dayjs/plugin/duration';
import type { Lesson } from '../models/lesson.model';

type Result = {
  latestLesson: Lesson | null;
  upcomingLesson: Lesson | null;
  previousLessons: Lesson[];
  upcomingDayJsDuration: Duration | null;
  loading: boolean;
  setKeyword: (keyword: string | null) => void;
  refetch: QueryObserverBaseResult['refetch'];
};

export function useStudentLessonList(): Result {
  const { serverClock, startClock, stopClock } = useClockSocket();
  const [keyword, setKeyword] = useState<string | null>(null);

  const {
    data: list,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery(
    getLessonsByCurrentStudentUser(keyword || undefined, {
      refetchOnWindowFocus: false,
      select: (data: any) => {
        const { latestLesson, upcomingLesson, previousLessons } = data;
        const transformedLatestLesson = latestLesson
          ? transformToLesson(latestLesson)
          : null;
        const transformedUpcomingLesson = upcomingLesson
          ? transformToLesson(upcomingLesson)
          : null;
        const transformedPreviousLessons = previousLessons?.length
          ? previousLessons.map((item: any) => transformToLesson(item))
          : [];

        return {
          latestLesson: transformedLatestLesson,
          upcomingLesson: transformedUpcomingLesson,
          previousLessons: transformedPreviousLessons,
        };
      },
    }),
  );

  const { latestLesson, upcomingLesson, previousLessons } = useMemo(
    () =>
      (list || {
        latestLesson: null,
        upcomingLesson: null,
        previousLessons: [],
      }) as {
        latestLesson: Lesson | null;
        upcomingLesson: Lesson | null;
        previousLessons: Lesson[];
      },
    [list],
  );

  const upcomingDayJsDuration = useMemo(() => {
    if (!upcomingLesson?.schedules?.length) {
      return null;
    }
    return getDayJsDuration(upcomingLesson.schedules[0].startDate, serverClock);
  }, [upcomingLesson, serverClock]);

  // Stop clock ticking if current lesson is already available
  useEffect(() => {
    if (isLoading || isRefetching) {
      return;
    }

    upcomingLesson ? startClock() : stopClock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upcomingLesson, isLoading, isRefetching]);

  useEffect(() => {
    if (!upcomingDayJsDuration || upcomingDayJsDuration.asSeconds() > 0) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: queryLessonKey.list });
  }, [upcomingDayJsDuration]);

  return {
    latestLesson,
    upcomingLesson,
    previousLessons,
    upcomingDayJsDuration,
    loading: isLoading || isRefetching,
    setKeyword,
    refetch,
  };
}
