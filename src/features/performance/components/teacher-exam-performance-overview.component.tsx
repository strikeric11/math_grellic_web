import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import {
  StudentPerformanceType,
  TeacherExamPerformance,
} from '../models/performance.model';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  examPerformance?: TeacherExamPerformance;
  loading?: boolean;
};

const EXAM_WRAPPER_CLASSNAME = 'flex flex-col items-center w-36';
const EXAM_VALUE_CLASSNAME = 'text-2xl font-bold text-primary-hue-purple';
const EXAM_LABEL_CLASSNAME = 'text-sm';

export const TeacherExamPerformanceOverview = memo(function ({
  loading,
  className,
  examPerformance,
  ...moreProps
}: Props) {
  const [totalExamCount, totalExamPoints, overallExamCompletionPercent] =
    useMemo(
      () => [
        examPerformance?.totalExamCount || 0,
        examPerformance?.totalExamPoints || 0,
        examPerformance?.overallExamCompletionPercent || 0,
      ],
      [examPerformance],
    );

  return (
    <div
      className={cx('flex w-full flex-col gap-2.5', className)}
      {...moreProps}
    >
      <h2 className='text-lg'>Exams Overview</h2>
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
            <div className={EXAM_WRAPPER_CLASSNAME}>
              <span className={EXAM_VALUE_CLASSNAME}>{totalExamCount}</span>
              <span className={EXAM_LABEL_CLASSNAME}>Total Exams</span>
            </div>
            <div className={cx(EXAM_WRAPPER_CLASSNAME, 'flex-1')}>
              <span className={EXAM_VALUE_CLASSNAME}>{totalExamPoints}</span>
              <span className={EXAM_LABEL_CLASSNAME}>Total Exam Points</span>
            </div>
          </BaseSurface>
          <BaseSurface
            rounded='sm'
            className='flex animate-fastFadeIn justify-center !p-4'
          >
            <BaseProgressCircle
              percent={overallExamCompletionPercent}
              performance={StudentPerformanceType.Exam}
              label='Overall Completion'
            />
          </BaseSurface>
        </>
      )}
    </div>
  );
});
