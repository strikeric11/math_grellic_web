import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import dayjs from '#/config/dayjs.config';
import { getDayJsDuration } from '#/utils/time.util';
import { queryClient } from '#/config/react-query-client.config';
import { queryExamKey } from '#/config/react-query-keys.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useClockSocket } from '#/core/hooks/use-clock-socket.hook';
import { transformToExam } from '../helpers/exam-transform.helper';
import {
  getExamBySlugAndCurrentStudentUser,
  setExamCompletion as setExamCompletionApi,
} from '../api/student-exam.api';
import { ExamScheduleStatus } from '../models/exam.model';

import type { Duration } from 'dayjs/plugin/duration';
import type { Exam, ExamCompletion } from '../models/exam.model';
import type {
  ExamAnswerFormData,
  StudentExamFormData,
} from '../models/exam-form-data.model';

type Result = {
  isExpired: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  loading: boolean;
  title: string;
  exam: Exam | null;
  formData: StudentExamFormData | null;
  upcomingDayJsDuration: Duration | null;
  ongoingDayJsDuration: Duration | null;
  syncAnswers: (data: StudentExamFormData) => Promise<ExamCompletion>;
  setExamCompletion: (
    data: StudentExamFormData,
  ) => Promise<ExamCompletion | null>;
};

export function useStudentExamSingle(): Result {
  const { slug } = useParams();
  const { serverClock, startClock, stopClock } = useClockSocket();
  const socket = useBoundStore((state) => state.socket);
  const user = useBoundStore((state) => state.user);
  const [isDone, setIsDone] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [formData, setFormData] = useState<StudentExamFormData | null>(null);

  const [ongoingDayJsDuration, setOngoingDayJsDuration] =
    useState<Duration | null>(null);

  const {
    data: exam,
    isLoading,
    isFetching,
  } = useQuery(
    getExamBySlugAndCurrentStudentUser(
      { slug: slug || '' },
      {
        enabled: !!slug,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToExam(data, true);
        },
      },
    ),
  );

  const { mutateAsync, isLoading: isMutateLoading } = useMutation(
    setExamCompletionApi({
      onSuccess: () =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryExamKey.list,
          }),
          queryClient.invalidateQueries({
            queryKey: [...queryExamKey.single, { slug }],
          }),
        ]),
    }),
  );

  const [title, scheduleStatus] = useMemo(
    () => [exam?.title || '', exam?.scheduleStatus],
    [exam],
  );

  const upcomingDayJsDuration = useMemo(() => {
    if (
      exam?.scheduleStatus !== ExamScheduleStatus.Upcoming ||
      !exam?.schedules?.length
    ) {
      return null;
    }
    return getDayJsDuration(exam.schedules[0].startDate, serverClock);
  }, [exam, serverClock]);

  const setExamAsExpired = useCallback(() => {
    setTimeout(() => {
      setIsExpired(true);
    }, 5000);
  }, []);

  const setOngoingDuration = useCallback((countdown: number) => {
    setOngoingDayJsDuration(dayjs.duration(countdown, 's'));
  }, []);

  const startExam = useCallback(() => {
    socket?.removeAllListeners('exam-tick');
    socket?.removeAllListeners('exam-take-expired');
    socket?.on('exam-tick', setOngoingDuration);
    socket?.on('exam-take-expired', setExamAsExpired);
  }, [socket, setOngoingDuration, setExamAsExpired]);

  const stopExam = useCallback(() => {
    socket?.removeAllListeners('exam-tick');
    socket?.removeAllListeners('exam-take-expired');
  }, [socket]);

  const syncAnswers = useCallback(
    async (data: StudentExamFormData) => {
      const updatedData = {
        roomName,
        studentId: user?.userAccount?.id || 0,
        answers: data.answers,
      };

      const completion = await socket?.emitWithAck(
        'exam-sync-answers',
        updatedData,
      );
      return completion;
    },
    [socket, roomName, user],
  );

  const setExamCompletion = useCallback(
    async (data: StudentExamFormData) => {
      const isDone = await socket?.emitWithAck('exam-take-done', {
        roomName,
        studentId: user?.userAccount?.id || 0,
      });

      if (!isDone) {
        throw new Error('Cannot submit exam, please try again');
      }

      stopExam();
      return mutateAsync({ slug: slug || '', data });
    },
    [slug, roomName, user, socket, stopExam, mutateAsync],
  );

  // Stop clock ticking if current lesson is already available
  useEffect(() => {
    if (!exam) {
      return;
    }

    exam.scheduleStatus === ExamScheduleStatus.Upcoming
      ? startClock()
      : stopClock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam]);

  useEffect(() => {
    if (!upcomingDayJsDuration || upcomingDayJsDuration.asSeconds() > 0) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: queryExamKey.list });
    queryClient.invalidateQueries({
      queryKey: [...queryExamKey.single, { slug }],
    });
  }, [slug, upcomingDayJsDuration]);

  useEffect(() => {
    if (exam?.scheduleStatus !== ExamScheduleStatus.Ongoing) {
      stopExam();
      return;
    }

    // Join room and subscribe to exam duration
    socket?.emit(
      'exam-take',
      {
        slug: exam.slug,
        questions: exam.questions,
        studentId: user?.userAccount?.id || 0,
      },
      (result: { roomName: string; answers: ExamAnswerFormData[] }) => {
        if (!result) {
          return;
        }

        const fd = {
          id: exam.id,
          scheduleId: exam.schedules?.length ? exam.schedules[0].id : 0,
          answers: result.answers,
        };

        setRoomName(result.roomName);
        setFormData(fd);
        startExam();
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleStatus, socket]);

  useEffect(() => {
    return () => {
      stopExam();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isExpired,
    isDone,
    setIsDone,
    loading: isLoading || isFetching || isMutateLoading,
    title,
    exam: exam || null,
    formData,
    upcomingDayJsDuration,
    ongoingDayJsDuration,
    syncAnswers,
    setExamCompletion,
  };
}
