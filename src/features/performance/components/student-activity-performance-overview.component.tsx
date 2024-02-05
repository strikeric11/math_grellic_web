import { memo, useMemo } from 'react';
import cx from 'classix';

import { generateOrdinalSuffix } from '#/utils/string.util';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { StudentPerformanceType } from '../models/performance.model';
import { PerformanceRankAwardImg } from './performance-rank-award-img.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '../models/performance.model';

type Props = ComponentProps<'div'> & {
  studentPerformance?: StudentPerformance | null;
  loading?: boolean;
};

const PERFORMANCE_PATH = `/${studentBaseRoute}/${studentRoutes.performance.to}`;

const ACTIVITY_WRAPPER_CLASSNAME = 'flex flex-col items-center w-36';
const ACTIVITY_VALUE_CLASSNAME = 'text-2xl font-bold text-primary-hue-teal';
const ACTIVITY_LABEL_CLASSNAME = 'text-sm';

export const StudentActivityPerformanceOverview = memo(function ({
  loading,
  className,
  studentPerformance,
  ...moreProps
}: Props) {
  const [
    totalActivityCount,
    activitiesCompletedCount,
    overallActivityRank,
    overallActivityCompletionPercent,
  ] = useMemo(
    () => [
      studentPerformance?.totalActivityCount,
      studentPerformance?.activitiesCompletedCount,
      studentPerformance?.overallActivityRank,
      studentPerformance?.overallActivityCompletionPercent || 0,
    ],
    [studentPerformance],
  );

  const overallActivityRankText = useMemo(
    () =>
      overallActivityRank == null
        ? '-'
        : generateOrdinalSuffix(overallActivityRank),
    [overallActivityRank],
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
            className='flex flex-1 animate-fastFadeIn flex-col items-center gap-2.5 !p-4'
          >
            <div className='flex flex-1 items-center justify-center gap-2 font-bold text-primary-hue-teal'>
              <div className='flex w-24 shrink-0 items-center justify-center gap-x-2.5'>
                <span className='text-3xl'>{overallActivityRankText}</span>
                {overallActivityRank != null && overallActivityRank <= 10 && (
                  <PerformanceRankAwardImg
                    rank={overallActivityRank}
                    size='sm'
                  />
                )}
              </div>
            </div>
            <span className={cx(ACTIVITY_LABEL_CLASSNAME, 'font-medium')}>
              Current Overall Rank
            </span>
          </BaseSurface>
          <BaseSurface
            rounded='sm'
            className='flex animate-fastFadeIn justify-center !p-4'
          >
            <div className='flex flex-1 items-center justify-center font-medium'>
              <div className={ACTIVITY_WRAPPER_CLASSNAME}>
                <span className={ACTIVITY_VALUE_CLASSNAME}>
                  {totalActivityCount}
                </span>
                <span className={ACTIVITY_LABEL_CLASSNAME}>
                  Total Activities
                </span>
              </div>
              <div className={ACTIVITY_WRAPPER_CLASSNAME}>
                <span className={ACTIVITY_VALUE_CLASSNAME}>
                  {activitiesCompletedCount}
                </span>
                <span className={ACTIVITY_LABEL_CLASSNAME}>
                  Activities Completed
                </span>
              </div>
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
