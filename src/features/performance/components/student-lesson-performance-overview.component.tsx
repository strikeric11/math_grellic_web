import { memo, useMemo } from 'react';
import cx from 'classix';

import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { StudentPerformanceType } from '../models/performance.model';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '../models/performance.model';

type Props = ComponentProps<'div'> & {
  studentPerformance?: StudentPerformance | null;
  loading?: boolean;
};

const PERFORMANCE_PATH = `/${studentBaseRoute}/${studentRoutes.performance.to}`;

const LESSON_WRAPPER_CLASSNAME = 'flex flex-col items-center w-36';
const LESSON_VALUE_CLASSNAME = 'text-2xl font-bold text-primary';
const LESSON_LABEL_CLASSNAME = 'text-sm';

export const StudentLessonPerformanceOverview = memo(function ({
  loading,
  className,
  studentPerformance,
  ...moreProps
}: Props) {
  const [
    currentLessonCount,
    lessonsCompletedCount,
    overallLessonCompletionPercent,
  ] = useMemo(
    () => [
      studentPerformance?.currentLessonCount || 0,
      studentPerformance?.lessonsCompletedCount || 0,
      studentPerformance?.overallLessonCompletionPercent || 0,
    ],
    [studentPerformance],
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
              <span className={LESSON_VALUE_CLASSNAME}>
                {currentLessonCount}
              </span>
              <span className={LESSON_LABEL_CLASSNAME}>Current Lessons</span>
            </div>
            <div className={cx(LESSON_WRAPPER_CLASSNAME, 'flex-1')}>
              <span className={LESSON_VALUE_CLASSNAME}>
                {lessonsCompletedCount}
              </span>
              <span className={LESSON_LABEL_CLASSNAME}>Lessons Completed</span>
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
      <div className='flex flex-1 items-center justify-center'>
        <BaseLink
          to={PERFORMANCE_PATH}
          rightIconName='arrow-circle-right'
          size='xs'
        >
          View Performance
        </BaseLink>
      </div>
    </div>
  );
});
