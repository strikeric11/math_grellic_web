import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { generateOrdinalSuffix } from '#/utils/string.util';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseTag } from '#/base/components/base-tag.component';
import { PerformanceRankAwardImg } from './performance-rank-award-img.component';

import type { ComponentProps } from 'react';
import type { Exam } from '#/exam/models/exam.model';

type Props = Omit<ComponentProps<'div'>, 'onClick'> & {
  exam: Exam;
  isUpcoming?: boolean;
  last?: boolean;
  onClick?: (exam?: Exam) => void;
};

export const StudentExamPerformanceDetails = memo(function ({
  className,
  exam,
  isUpcoming,
  last,
  onClick,
  ...moreProps
}: Props) {
  const [orderNumber, title, totalPoints, passingPoints, completion, rank] =
    useMemo(
      () => [
        exam.orderNumber,
        exam.title,
        exam.visibleQuestionsCount * exam.pointsPerQuestion,
        exam.passingPoints,
        exam.completions?.length ? exam.completions[0] : undefined,
        exam.rank,
      ],
      [exam],
    );

  const hasPassed = useMemo(
    () => (completion?.score || 0) >= passingPoints,
    [completion, passingPoints],
  );

  const scoreText = useMemo(() => {
    const totalPointsText = totalPoints.toString().padStart(2, '0');

    if (!completion) {
      return `-/${totalPointsText}`;
    }

    const studentScore = (completion.score || 0).toString().padStart(2, '0');

    return `${studentScore}/${totalPointsText}`;
  }, [completion, totalPoints]);

  const statusText = useMemo(() => {
    if (!completion) {
      return 'Expired';
    }
    return hasPassed ? 'Passed' : 'Failed';
  }, [completion, hasPassed]);

  const rankText = useMemo(
    () => (rank == null ? '-' : generateOrdinalSuffix(rank)),
    [rank],
  );

  const handleClick = useCallback(() => {
    onClick && onClick(exam);
  }, [exam, onClick]);

  return (
    <>
      <div
        className={cx(
          'flex w-full flex-col items-start justify-between gap-2.5 overflow-hidden rounded px-4 py-2 sm:flex-row sm:items-center sm:gap-0',
          onClick &&
            'group cursor-pointer transition-colors duration-75 hover:bg-primary-hue-purple-focus hover:!text-white',
          className,
        )}
        onClick={handleClick}
        {...moreProps}
      >
        <div className='flex items-center gap-x-2.5'>
          {isUpcoming ? (
            <BaseIcon
              className='text-accent/40'
              name='x-circle'
              size={28}
              weight='bold'
            />
          ) : hasPassed ? (
            <BaseIcon
              className='text-green-500'
              name='check-circle'
              size={28}
              weight='bold'
            />
          ) : (
            <BaseIcon
              className={completion ? 'text-red-500' : 'text-accent/40'}
              name='x-circle'
              size={28}
              weight='bold'
            />
          )}

          <span>
            Exam {orderNumber} - {title}
          </span>
        </div>
        <div className='flex w-full items-center justify-center gap-x-4 text-primary-hue-purple group-hover:text-white sm:w-auto sm:justify-start'>
          <div className='w-20 text-center text-lg font-medium'>
            {scoreText}
          </div>
          <BaseTag className='w-20 !bg-primary-hue-purple'>
            {statusText}
          </BaseTag>
          <div className='flex min-w-[104px] items-center justify-center gap-x-2.5'>
            <span className='text-2xl font-bold'>{rankText}</span>
            {rank != null && rank <= 10 && (
              <PerformanceRankAwardImg rank={rank} size='sm' />
            )}
          </div>
        </div>
      </div>
      {!last && <BaseDivider className='mb-1.5 mt-1.5 block sm:hidden' />}
    </>
  );
});
