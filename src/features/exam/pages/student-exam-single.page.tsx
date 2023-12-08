import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import { BaseScene } from '#/base/components/base-scene.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { ExamScheduleStatus } from '../models/exam.model';
import { useStudentExamSingle } from '../hooks/use-student-exam-single.hook';
import { StudentExamSingleUpcomingNote } from '../components/student-exam-single-upcoming-note.component';
import { StudentExamTakeStart } from '../components/student-exam-take-start.component';
import { StudentExamTakeForm } from '../components/student-exam-take-form.component';
import { StudentExamTakeDone } from '../components/student-exam-take-done.component';

import type { Duration } from 'dayjs/plugin/duration';
import type { Exam, ExamCompletion } from '../models/exam.model';
import type { StudentExamFormData } from '../models/exam-form-data.model';

type ExamTakeProps = {
  isExpired: boolean;
  isDone: boolean;
  exam: Exam;
  formData: StudentExamFormData | null;
  ongoingDuration: Duration | null;
  onSyncAnswers: (data: StudentExamFormData) => Promise<ExamCompletion>;
  onSubmit: (data: StudentExamFormData) => Promise<ExamCompletion | null>;
  onDone: (isDone: boolean) => void;
};

const ExamTake = memo(function ({
  isExpired,
  isDone,
  exam,
  formData,
  ongoingDuration,
  onSyncAnswers,
  onSubmit,
  onDone,
}: ExamTakeProps) {
  const [startExam, setStartExam] = useState(false);
  const [description, coveredLessons, examCompletion, isPast] = useMemo(
    () => [
      exam.description,
      exam.coveredLessons,
      exam?.completions?.length ? exam.completions[0] : null,
      exam.scheduleStatus === ExamScheduleStatus.Past,
    ],
    [exam],
  );

  const isOngoing = useMemo(
    () => ongoingDuration && !!ongoingDuration.asSeconds(),
    [ongoingDuration],
  );

  const handleStartExam = useCallback(() => {
    setStartExam(true);
  }, []);

  if (examCompletion && (isDone || !isOngoing)) {
    return (
      <StudentExamTakeDone
        className='mx-auto max-w-screen-sm'
        exam={exam}
        examCompletion={examCompletion}
      />
    );
  } else if (!examCompletion && isPast) {
    return (
      <StudentExamTakeDone
        className='mx-auto max-w-screen-sm'
        exam={exam}
        isExpired
      />
    );
  }

  return (
    <>
      {!startExam ? (
        <StudentExamTakeStart
          className='mx-auto max-w-screen-sm'
          description={description}
          coveredLessons={coveredLessons}
          onStart={handleStartExam}
        />
      ) : (
        formData && (
          <StudentExamTakeForm
            className='flex-1 py-5'
            isExpired={isExpired}
            isDone={isDone}
            exam={exam}
            formData={formData}
            ongoingDuration={ongoingDuration}
            onSyncAnswers={onSyncAnswers}
            onSubmit={onSubmit}
            onDone={onDone}
          />
        )
      )}
    </>
  );
});

export function StudentExamSinglePage() {
  const {
    isExpired,
    isDone,
    setIsDone,
    loading,
    title,
    exam,
    formData,
    upcomingDayJsDuration,
    ongoingDayJsDuration,
    syncAnswers,
    setExamCompletion,
  } = useStudentExamSingle();

  const data: any = useLoaderData();

  // Prevent student from copy and pasting questions and choices
  useEffect(() => {
    const handleCopyPaste = (event: ClipboardEvent) => {
      event.preventDefault();
    };

    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);

    return () => {
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, []);

  if (!exam) {
    return null;
  }

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene title={title}>
        {upcomingDayJsDuration ? (
          <StudentExamSingleUpcomingNote
            loading={loading}
            exam={exam}
            upcomingDuration={upcomingDayJsDuration}
          />
        ) : (
          <ExamTake
            isExpired={isExpired}
            isDone={isDone}
            exam={exam}
            formData={formData}
            ongoingDuration={ongoingDayJsDuration}
            onSyncAnswers={syncAnswers}
            onSubmit={setExamCompletion}
            onDone={setIsDone}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
