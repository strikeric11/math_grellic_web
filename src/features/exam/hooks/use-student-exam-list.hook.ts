import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getDayJsDuration } from '#/utils/time.util';
import { queryClient } from '#/config/react-query-client.config';
import { queryExamKey } from '#/config/react-query-keys.config';
import { useClockSocket } from '#/core/hooks/use-clock-socket.hook';
import { transformToExam } from '../helpers/exam-transform.helper';
import { getExamsByCurrentStudentUser } from '../api/student-exam.api';

import type { QueryObserverBaseResult } from '@tanstack/react-query';
import type {
  Exam,
  ExamWithDuration,
  StudentExamList,
} from '../models/exam.model';

type Result = {
  latestExam: Exam | null;
  previousExams: Exam[];
  upcomingExamWithDuration: ExamWithDuration;
  ongoingExamsWithDurations: ExamWithDuration[];
  loading: boolean;
  setKeyword: (keyword: string | null) => void;
  refetch: QueryObserverBaseResult['refetch'];
};

export function useStudentExamList(): Result {
  const { serverClock, startClock, stopClock } = useClockSocket();
  const [keyword, setKeyword] = useState<string | null>(null);

  const {
    data: list,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery(
    getExamsByCurrentStudentUser(keyword || undefined, {
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

  const { latestExam, upcomingExam, previousExams, ongoingExams } = useMemo(
    () =>
      (list || {
        latestExam: null,
        upcomingExam: null,
        previousExams: [],
        ongoingExams: [],
      }) as StudentExamList,
    [list],
  );

  const upcomingDayJsDuration = useMemo(() => {
    if (!upcomingExam?.schedules?.length) {
      return null;
    }
    return getDayJsDuration(upcomingExam.schedules[0].startDate, serverClock);
  }, [upcomingExam, serverClock]);

  const upcomingExamWithDuration = useMemo(
    () => ({ exam: upcomingExam, duration: upcomingDayJsDuration }),
    [upcomingExam, upcomingDayJsDuration],
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

  // Stop clock ticking if current exam is already available
  useEffect(() => {
    if (isLoading || isRefetching) {
      return;
    }

    upcomingExam ? startClock() : stopClock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upcomingExam, isLoading, isRefetching]);

  useEffect(() => {
    if (!upcomingDayJsDuration || upcomingDayJsDuration.asSeconds() > 0) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: queryExamKey.list });
  }, [upcomingDayJsDuration]);

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
    latestExam,
    previousExams,
    upcomingExamWithDuration,
    ongoingExamsWithDurations,
    loading: isLoading || isRefetching,
    setKeyword,
    refetch,
  };
}
