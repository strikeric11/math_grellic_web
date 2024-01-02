import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryExamKey, queryLessonKey } from '#/config/react-query-keys.config';
import { getDayJsDuration } from '#/utils/time.util';
import { transformToLesson } from '#/lesson/helpers/lesson-transform.helper';
import { transformToExam } from '#/exam/helpers/exam-transform.helper';
import { transformToActivity } from '#/activity/helpers/activity-transform.helper';
import { getLessonsByCurrentStudentUser } from '#/lesson/api/student-lesson.api';
import { getExamsByCurrentStudentUser } from '#/exam/api/student-exam.api';
import { getActivitiesByCurrentStudentUser } from '#/activity/api/student-activity.api';
import { useClockSocket } from '#/core/hooks/use-clock-socket.hook';

import type {
  Lesson,
  LessonWithDuration,
  StudentLessonList,
} from '#/lesson/models/lesson.model';
import type {
  Exam,
  ExamWithDuration,
  StudentExamList,
} from '#/exam/models/exam.model';
import type { Activity } from '#/activity/models/activity.model';

type Result = {
  latestLesson: Lesson | null;
  upcomingLessonWithDuration: LessonWithDuration;
  previousLessons: Lesson[];
  latestExam: Exam | null;
  previousExams: Exam[];
  upcomingExamWithDuration: ExamWithDuration;
  ongoingExamsWithDurations: ExamWithDuration[];
  activities: Activity[];
  refresh: () => void;
  loading?: boolean;
};

export function useStudentCurriculumSnippets(): Result {
  const { serverClock, startClock, stopClock } = useClockSocket();

  const {
    data: lessonList,
    isLoading: isLessonLoading,
    isRefetching: isLessonRefetching,
    refetch: refetchLesson,
  } = useQuery(
    getLessonsByCurrentStudentUser(undefined, {
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

  const {
    data: examList,
    isLoading: isExamLoading,
    isRefetching: isExamRefetching,
    refetch: refetchExam,
  } = useQuery(
    getExamsByCurrentStudentUser(undefined, {
      refetchOnWindowFocus: false,
      select: (data: any) => {
        const { latestExam, upcomingExam, previousExams, ongoingExams } = data;
        const transformedLatestExam = latestExam
          ? transformToExam(latestExam)
          : null;

        const transformedUpcomingExam = upcomingExam
          ? transformToExam(upcomingExam)
          : null;

        const transformedPreviousExams = previousExams?.length
          ? previousExams.map((item: any) => transformToExam(item))
          : [];

        const transformedOngoingExams = ongoingExams?.length
          ? ongoingExams.map((item: any) => transformToExam(item))
          : [];

        return {
          latestExam: transformedLatestExam,
          upcomingExam: transformedUpcomingExam,
          previousExams: transformedPreviousExams,
          ongoingExams: transformedOngoingExams,
        };
      },
    }),
  );

  const {
    data: activityList,
    isLoading: isActivityLoading,
    isRefetching: isActivityRefetching,
    refetch: refetchActivity,
  } = useQuery(
    getActivitiesByCurrentStudentUser(undefined, {
      refetchOnWindowFocus: false,
      select: (data: any) => {
        const { featuredActivities, otherActivities } = data;

        const transformedFeaturedActivities = featuredActivities?.length
          ? featuredActivities.map((item: any) => transformToActivity(item))
          : [];

        const transformedOtherActivities = otherActivities?.length
          ? otherActivities.map((item: any) => transformToActivity(item))
          : [];

        return {
          featuredActivities: transformedFeaturedActivities,
          otherActivities: transformedOtherActivities,
        };
      },
    }),
  );

  const { latestLesson, upcomingLesson, previousLessons } = useMemo(
    () =>
      (lessonList || {
        latestLesson: null,
        upcomingLesson: null,
        previousLessons: [],
      }) as StudentLessonList,
    [lessonList],
  );

  const { latestExam, upcomingExam, previousExams, ongoingExams } = useMemo(
    () =>
      (examList || {
        latestExam: null,
        upcomingExam: null,
        previousExams: [],
        ongoingExams: [],
      }) as StudentExamList,
    [examList],
  );

  const activities = useMemo(
    () => [
      ...(activityList?.featuredActivities || []),
      ...(activityList?.otherActivities || []),
    ],
    [activityList],
  );

  const upcomingLessonDayJsDuration = useMemo(() => {
    if (!upcomingLesson?.schedules?.length) {
      return null;
    }
    return getDayJsDuration(upcomingLesson.schedules[0].startDate, serverClock);
  }, [upcomingLesson, serverClock]);

  const upcomingExamDayJsDuration = useMemo(() => {
    if (!upcomingExam?.schedules?.length) {
      return null;
    }
    return getDayJsDuration(upcomingExam.schedules[0].startDate, serverClock);
  }, [upcomingExam, serverClock]);

  const upcomingLessonWithDuration = useMemo(
    () => ({ lesson: upcomingLesson, duration: upcomingLessonDayJsDuration }),
    [upcomingLesson, upcomingLessonDayJsDuration],
  );

  const upcomingExamWithDuration = useMemo(
    () => ({ exam: upcomingExam, duration: upcomingExamDayJsDuration }),
    [upcomingExam, upcomingExamDayJsDuration],
  );

  const ongoingExamsWithDurations = useMemo(() => {
    if (!ongoingExams?.length) {
      return [];
    }

    const examsWithDurations: ExamWithDuration[] = [];
    ongoingExams.forEach((exam) => {
      const schedule = exam.schedules?.length ? exam.schedules[0] : null;

      if (!schedule) {
        return;
      }

      const duration = getDayJsDuration(schedule.endDate, serverClock);
      examsWithDurations.push({ exam, duration });
    });

    return examsWithDurations;
  }, [ongoingExams, serverClock]);

  const refresh = useCallback(() => {
    refetchLesson();
    refetchExam();
    refetchActivity();
  }, [refetchLesson, refetchExam, refetchActivity]);

  // Stop clock ticking if current exam/lesson is already available
  useEffect(() => {
    if (
      isLessonLoading ||
      isLessonRefetching ||
      isExamLoading ||
      isExamRefetching
    ) {
      return;
    }

    !upcomingLesson && !upcomingExam ? stopClock() : startClock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    upcomingLesson,
    upcomingExam,
    isLessonLoading,
    isLessonRefetching,
    isExamLoading,
    isExamRefetching,
  ]);

  useEffect(() => {
    if (
      !upcomingLessonDayJsDuration ||
      upcomingLessonDayJsDuration.asSeconds() > 0
    ) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: queryLessonKey.list });
  }, [upcomingLessonDayJsDuration]);

  useEffect(() => {
    if (
      !upcomingExamDayJsDuration ||
      upcomingExamDayJsDuration.asSeconds() > 0
    ) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: queryExamKey.list });
  }, [upcomingExamDayJsDuration]);

  useEffect(() => {
    if (!ongoingExamsWithDurations.length) {
      return;
    }

    ongoingExamsWithDurations.forEach((ewd) => {
      if (!ewd.duration || ewd.duration.asSeconds() > 0) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryExamKey.list });
    });
  }, [ongoingExamsWithDurations]);

  return {
    latestLesson,
    upcomingLessonWithDuration,
    previousLessons,
    latestExam,
    previousExams,
    upcomingExamWithDuration,
    ongoingExamsWithDurations,
    activities,
    refresh,
    loading:
      isLessonLoading ||
      isLessonRefetching ||
      isExamLoading ||
      isExamRefetching ||
      isActivityLoading ||
      isActivityRefetching,
  };
}
