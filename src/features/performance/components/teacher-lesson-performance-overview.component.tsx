import { memo, useMemo } from 'react';
import cx from 'classix';

import { convertSecondsToDuration } from '#/utils/time.util';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { StudentPerformanceType } from '../models/performance.model';

import type { TeacherLessonPerformance } from '../models/performance.model';
import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  lessonPerformance?: TeacherLessonPerformance;
  loading?: boolean;
};

const LESSON_WRAPPER_CLASSNAME = 'flex flex-col items-center w-36';
const LESSON_VALUE_CLASSNAME = 'text-2xl font-bold text-primary';
const LESSON_LABEL_CLASSNAME = 'text-sm';

export const TeacherLessonPerformanceOverview = memo(function ({
  loading,
  className,
  lessonPerformance,
  ...moreProps
}: Props) {
  const [
    totalLessonCount,
    totalLessonDuration,
    overallLessonCompletionPercent,
  ] = useMemo(
    () => [
      lessonPerformance?.totalLessonCount || 0,
      convertSecondsToDuration(
        lessonPerformance?.totalLessonDurationSeconds || 0,
      ),
      lessonPerformance?.overallLessonCompletionPercent || 0,
    ],
    [lessonPerformance],
  );

  return (
    <div
      className={cx('flex w-full flex-col gap-2.5', className)}
      {...moreProps}
    >
      <h2 className='text-lg'>Lessons Overview</h2>
      {loading ? (
        <div className='flex w-full items-center justify-center'>
          <BaseSpinner />
        </div>
      ) : (
        <>
          <BaseSurface
            rounded='sm'
            className='flex animate-fastFadeIn justify-center !p-2.5 font-medium'
          >
            <div className={LESSON_WRAPPER_CLASSNAME}>
              <span className={LESSON_VALUE_CLASSNAME}>{totalLessonCount}</span>
              <span className={LESSON_LABEL_CLASSNAME}>Total Lessons</span>
            </div>
            <div className={cx(LESSON_WRAPPER_CLASSNAME, 'flex-1')}>
              <span className={LESSON_VALUE_CLASSNAME}>
                {totalLessonDuration}
              </span>
              <span className={LESSON_LABEL_CLASSNAME}>
                Total Lessons Duration
              </span>
            </div>
          </BaseSurface>
          <BaseSurface
            rounded='sm'
            className='flex animate-fastFadeIn justify-center !p-4'
          >
            <BaseProgressCircle
              percent={overallLessonCompletionPercent}
              performance={StudentPerformanceType.Lesson}
              label='Overall Completion'
            />
          </BaseSurface>
        </>
      )}
    </div>
  );
});
