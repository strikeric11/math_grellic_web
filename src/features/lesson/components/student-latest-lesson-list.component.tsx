import { memo } from 'react';
import cx from 'classix';

import {
  StudentLessonSingleCard,
  StudentLessonSingleCardSkeleton,
} from './student-lesson-single-card.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '../models/lesson.model';
import { BaseIconButton } from '#/base/components/base-icon-button.component';

type Props = ComponentProps<'div'> & {
  upcomingLesson: Lesson | null;
  latestLesson: Lesson | null;
  title?: string;
  loading?: boolean;
  onRefresh?: () => void;
};

export const StudentLatestLessonList = memo(function ({
  className,
  title = 'Latest Lessons',
  upcomingLesson,
  latestLesson,
  loading,
  onRefresh,
  // TODO upcoming lessons countdown
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
        <>
          <StudentLessonSingleCardSkeleton />
          <StudentLessonSingleCardSkeleton />
        </>
      ) : (
        <>
          {latestLesson && (
            <StudentLessonSingleCard lesson={latestLesson} primary />
          )}
          {upcomingLesson && (
            <StudentLessonSingleCard
              lesson={upcomingLesson}
              upcoming
              primary={!latestLesson}
            />
          )}
          {!latestLesson && !upcomingLesson && (
            <div className='w-full py-4 text-center'>No lessons to show</div>
          )}
        </>
      )}
    </div>
  );
});
