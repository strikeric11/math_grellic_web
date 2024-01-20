import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { StudentPerformanceType } from '../models/performance.model';

import type { ComponentProps } from 'react';
import type { TeacherClassPerformance } from '../models/performance.model';

type Props = ComponentProps<'div'> & {
  teacherClassPerformance: TeacherClassPerformance | null;
  loading?: boolean;
};

export const TeacherStudentPerformanceOverview = memo(function ({
  className,
  loading,
  teacherClassPerformance,
  ...moreProps
}: Props) {
  const [
    overallLessonCompletionPercent,
    overallExamCompletionPercent,
    overallActivityCompletionPercent,
  ] = useMemo(
    () => [
      teacherClassPerformance?.overallLessonCompletionPercent || 0,
      teacherClassPerformance?.overallExamCompletionPercent || 0,
      teacherClassPerformance?.overallActivityCompletionPercent || 0,
    ],
    [teacherClassPerformance],
  );

  return (
    <div
      className={cx('flex w-full flex-col gap-2.5', className)}
      {...moreProps}
    >
      <h2 className='text-lg'>Performance Overview</h2>
      {loading || !teacherClassPerformance ? (
        <div className='flex w-full items-center justify-center'>
          <BaseSpinner />
        </div>
      ) : (
        <BaseSurface
          rounded='sm'
          className='flex animate-fastFadeIn flex-col justify-center gap-4 !py-4'
        >
          <BaseProgressCircle
            percent={overallExamCompletionPercent}
            performance={StudentPerformanceType.Exam}
            label='Overall Exam Completion'
          />
          <BaseDivider />
          <BaseProgressCircle
            percent={overallActivityCompletionPercent}
            performance={StudentPerformanceType.Activity}
            label='Overall Activity Completion'
          />
          <BaseDivider />
          <BaseProgressCircle
            percent={overallLessonCompletionPercent}
            performance={StudentPerformanceType.Lesson}
            label='Overall Lesson Completion'
          />
        </BaseSurface>
      )}
    </div>
  );
});
