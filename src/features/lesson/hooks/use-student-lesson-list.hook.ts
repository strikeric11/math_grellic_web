import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { transformToLesson } from '../helpers/lesson-transform.helper';
import { getLessonsByCurrentStudentUser } from '../api/student-lesson.api';

import type { QueryObserverBaseResult } from '@tanstack/react-query';
import type { StudentLessonList } from '../models/lesson.model';

type Result = {
  list: StudentLessonList;
  loading: boolean;
  setKeyword: (keyword: string | null) => void;
  refetch: QueryObserverBaseResult['refetch'];
};

export function useStudentLessonList(): Result {
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

  return {
    list: list || {
      latestLesson: null,
      upcomingLesson: null,
      previousLessons: [],
    },
    loading: isLoading || isRefetching,
    setKeyword,
    refetch,
  };
}
