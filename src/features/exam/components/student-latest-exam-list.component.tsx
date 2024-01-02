import { memo } from 'react';
import cx from 'classix';

import { BaseIconButton } from '#/base/components/base-icon-button.component';
import {
  StudentExamSingleCard,
  StudentExamSingleCardSkeleton,
} from './student-exam-single-card.component';

import type { ComponentProps } from 'react';
import type { Exam, ExamWithDuration } from '../models/exam.model';

type Props = ComponentProps<'div'> & {
  latestExam: Exam | null;
  upcomingExamWithDuration: ExamWithDuration;
  ongoingExamsWithDurations: ExamWithDuration[];
  title?: string;
  loading?: boolean;
  onRefresh?: () => void;
};

export const StudentLatestExamList = memo(function ({
  className,
  latestExam,
  upcomingExamWithDuration: {
    exam: upcomingExam,
    duration: upcomingExamDuration,
  },
  ongoingExamsWithDurations,
  title = 'Latest Exams',
  loading,
  onRefresh,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx('flex w-full flex-col gap-2.5', className)}
      {...moreProps}
    >
      <div className='flex items-center justify-between'>
        <h2 className='text-lg'>{title}</h2>
        <BaseIconButton
          name='arrow-clockwise'
          variant='link'
          size='sm'
          onClick={onRefresh}
        />
      </div>
      {loading ? (
        [...Array(2)].map((_, index) => (
          <StudentExamSingleCardSkeleton key={index} />
        ))
      ) : (
        <>
          {!!ongoingExamsWithDurations.length &&
            ongoingExamsWithDurations.map(({ exam, duration }) => (
              <StudentExamSingleCard
                key={`oe-${exam?.id}`}
                exam={exam as Exam}
                ongoingDuration={duration}
                primary
              />
            ))}
          {!ongoingExamsWithDurations.length && latestExam && (
            <StudentExamSingleCard exam={latestExam} primary />
          )}
          {upcomingExam && (
            <StudentExamSingleCard
              exam={upcomingExam}
              upcomingDuration={upcomingExamDuration}
              primary={!latestExam}
            />
          )}
          {!latestExam &&
            !upcomingExam &&
            !ongoingExamsWithDurations?.length && (
              <div className='w-full py-4 text-center'>No exams to show</div>
            )}
        </>
      )}
    </div>
  );
});
