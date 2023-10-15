import { memo, useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { ExamScheduleStatus } from '#/core/models/core.model';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { useStudentExamSingle } from '../hooks/use-student-exam-single.hook';
import { StudentExamSingleUpcomingNote } from '../components/student-exam-single-upcoming-note.component';
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
  const [examCompletion, isPast] = useMemo(
    () => [
      exam?.completions?.length ? exam.completions[0] : null,
      exam.scheduleStatus === ExamScheduleStatus.Past,
    ],
    [exam],
  );

  const isOngoing = useMemo(
    () => ongoingDuration && !!ongoingDuration.asSeconds(),
    [ongoingDuration],
  );

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
      {formData && (
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
