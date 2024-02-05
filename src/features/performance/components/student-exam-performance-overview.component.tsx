import { memo, useMemo } from 'react';
import cx from 'classix';

import { generateOrdinalSuffix } from '#/utils/string.util';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseDivider } from '#/base/components/base-divider.component';
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

const EXAM_WRAPPER_CLASSNAME = 'flex flex-col items-center w-36';
const EXAM_VALUE_CLASSNAME = 'text-2xl font-bold text-primary-hue-purple';
const EXAM_LABEL_CLASSNAME = 'text-sm';

export const StudentExamPerformanceOverview = memo(function ({
  loading,
  className,
  studentPerformance,
  ...moreProps
}: Props) {
  const [
    currentExamCount,
    examsPassedCount,
    examsCompletedCount,
    examsFailedCount,
    examsExpiredCount,
    overallExamRank,
    overallExamScore,
    overallExamCompletionPercent,
  ] = useMemo(
    () => [
      studentPerformance?.currentExamCount,
      studentPerformance?.examsPassedCount,
      studentPerformance?.examsCompletedCount,
      studentPerformance?.examsFailedCount,
      studentPerformance?.examsExpiredCount,
      studentPerformance?.overallExamRank,
      studentPerformance?.overallExamScore,
      studentPerformance?.overallExamCompletionPercent || 0,
    ],
    [studentPerformance],
  );

  const overallExamRankText = useMemo(
    () =>
      overallExamRank == null ? '-' : generateOrdinalSuffix(overallExamRank),
    [overallExamRank],
  );

  const overallExamScoreText = useMemo(() => {
    if (overallExamScore == null) {
      return '-';
    }

    const pointText = overallExamScore > 1 ? 'Points' : 'Point';
    return `${overallExamScore} ${pointText}`;
  }, [overallExamScore]);

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
            className='flex flex-1 animate-fastFadeIn flex-col items-center gap-2.5 !p-4'
          >
            <div className='flex flex-1 items-center justify-center gap-2 font-bold text-primary-hue-purple'>
              <div className='flex w-24 shrink-0 items-center justify-center gap-x-2.5'>
                <span className='text-3xl'>{overallExamRankText}</span>
                {overallExamRank != null && overallExamRank <= 10 && (
                  <PerformanceRankAwardImg rank={overallExamRank} size='sm' />
                )}
              </div>
              <BaseDivider className='!h-10' vertical />
              <span className='inline-block w-24 shrink-0 text-center font-display text-xl tracking-tighter'>
                {overallExamScoreText}
              </span>
            </div>
            <span className={cx(EXAM_LABEL_CLASSNAME, 'font-medium')}>
              Current Overall Rank
            </span>
          </BaseSurface>
          <BaseSurface
            rounded='sm'
            className='flex animate-fastFadeIn justify-center !p-4'
          >
            <div className='flex flex-1 flex-col items-center justify-center font-medium'>
              <div className='grid w-fit grid-cols-2 gap-y-4'>
                <div className={EXAM_WRAPPER_CLASSNAME}>
                  <span className={EXAM_VALUE_CLASSNAME}>
                    {currentExamCount}
                  </span>
                  <span className={EXAM_LABEL_CLASSNAME}>Current Exams</span>
                </div>
                <div className={EXAM_WRAPPER_CLASSNAME}>
                  <span className={EXAM_VALUE_CLASSNAME}>
                    {examsPassedCount}
                  </span>
                  <span className={EXAM_LABEL_CLASSNAME}>Exams Passed</span>
                </div>
                <div className={EXAM_WRAPPER_CLASSNAME}>
                  <span className={EXAM_VALUE_CLASSNAME}>
                    {examsCompletedCount}
                  </span>
                  <span className={EXAM_LABEL_CLASSNAME}>Exams Completed</span>
                </div>
                <div className={EXAM_WRAPPER_CLASSNAME}>
                  <span className={EXAM_VALUE_CLASSNAME}>
                    {examsFailedCount}
                  </span>
                  <span className={EXAM_LABEL_CLASSNAME}>Exams Failed</span>
                </div>
                <div className={EXAM_WRAPPER_CLASSNAME}>
                  <span className={EXAM_VALUE_CLASSNAME}>
                    {examsExpiredCount}
                  </span>
                  <span className={EXAM_LABEL_CLASSNAME}>Exams Expired</span>
                </div>
              </div>
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
