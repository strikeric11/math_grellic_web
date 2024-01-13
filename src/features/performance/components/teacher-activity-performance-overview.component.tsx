import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import {
  StudentPerformanceType,
  TeacherActivityPerformance,
} from '../models/performance.model';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  activityPerformance?: TeacherActivityPerformance;
  loading?: boolean;
};

export const TeacherActivityPerformanceOverview = memo(function ({
  loading,
  className,
  activityPerformance,
  ...moreProps
}: Props) {
  const [totalActivityCount, overallActivityCompletionPercent] = useMemo(
    () => [
      activityPerformance?.totalActivityCount || 0,
      activityPerformance?.overallActivityCompletionPercent || 0,
    ],
    [activityPerformance],
  );

  return (
    <div
      className={cx('flex w-full flex-col gap-2.5', className)}
      {...moreProps}
    >
      <h2 className='text-lg'>Activities Overview</h2>
      {loading ? (
        <div className='flex w-full items-center justify-center'>
          <BaseSpinner />
        </div>
      ) : (
        <>
          <BaseSurface
            rounded='sm'
            className='flex animate-fastFadeIn justify-center !p-2.5'
          >
            <div className='flex w-36 flex-col items-center'>
              <span className='text-2xl font-bold text-primary-hue-teal'>
                {totalActivityCount}
              </span>
              <span className='text-sm'>Total Activities</span>
            </div>
          </BaseSurface>
          <BaseSurface
            rounded='sm'
            className='flex animate-fastFadeIn justify-center !p-4'
          >
            <BaseProgressCircle
              percent={overallActivityCompletionPercent}
              performance={StudentPerformanceType.Activity}
              label='Overall Completion'
            />
          </BaseSurface>
        </>
      )}
    </div>
  );
});
