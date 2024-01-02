import { memo } from 'react';
import cx from 'classix';

import { BaseIconButton } from '#/base/components/base-icon-button.component';
import {
  StudentLessonSingleCard,
  StudentLessonSingleCardSkeleton,
} from './student-lesson-single-card.component';

import type { ComponentProps } from 'react';
import type { Duration } from 'dayjs/plugin/duration';
import type { Lesson } from '../models/lesson.model';

type Props = ComponentProps<'div'> & {
  upcomingLesson: Lesson | null;
  latestLesson: Lesson | null;
  upcomingDuration?: Duration | null;
  title?: string;
  loading?: boolean;
  onRefresh?: () => void;
};

export const StudentLatestLessonList = memo(function ({
  className,
  upcomingLesson,
  latestLesson,
  upcomingDuration,
  title = 'Latest Lessons',
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
          <StudentLessonSingleCardSkeleton key={index} />
        ))
      ) : (
        <>
          {latestLesson && (
            <StudentLessonSingleCard lesson={latestLesson} primary fat />
          )}
          {upcomingLesson && (
            <StudentLessonSingleCard
              lesson={upcomingLesson}
              upcomingDuration={upcomingDuration}
              primary={!latestLesson}
              fat={!latestLesson}
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
