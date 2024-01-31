import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { generateOrdinalSuffix } from '#/utils/string.util';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { ActivityCategoryType } from '#/activity/models/activity.model';
import { PerformanceRankAwardImg } from './performance-rank-award-img.component';

import type { ComponentProps } from 'react';
import type { Activity } from '#/activity/models/activity.model';

type Props = Omit<ComponentProps<'div'>, 'onClick'> & {
  activity: Activity;
  last?: boolean;
  onClick?: (activity?: Activity) => void;
};

export const StudentActivityPerformanceDetails = memo(function ({
  className,
  activity,
  last,
  onClick,
  ...moreProps
}: Props) {
  const [orderNumber, title, gameType, completions, rank] = useMemo(
    () => [
      activity.orderNumber,
      activity.title,
      activity.game.type,
      activity.categories
        .map((cat) => (cat.completions?.length ? cat.completions[0] : null))
        .filter((com) => !!com),
      activity.rank,
    ],
    [activity],
  );

  const scoreText = useMemo(() => {
    if (!completions.length) {
      return '-';
    }

    if (gameType === ActivityCategoryType.Point) {
      const score = completions.reduce(
        (total, com) => total + (com?.score || 0),
        0,
      );
      return `${score} ${score > 1 ? 'Points' : 'Point'}`;
    } else if (gameType === ActivityCategoryType.Stage) {
      const score = completions.reduce(
        (total, com) => total + (com?.score || 0),
        0,
      );
      return `${score} ${score > 1 ? 'Levels' : 'Level'}`;
    } else {
      if (completions.length !== 3) {
        return '-';
      }

      const score =
        completions.reduce(
          (total, com) => total + (com?.timeCompletedSeconds || 0),
          0,
        ) / 3;
      return `${score} ${score > 1 ? 'Seconds' : 'Second'}`;
    }
  }, [gameType, completions]);

  const rankText = useMemo(
    () => (rank == null ? '-' : generateOrdinalSuffix(rank)),
    [rank],
  );

  const isCompleted = useMemo(() => {
    if (gameType === ActivityCategoryType.Stage) {
      return !!completions.length;
    } else {
      return completions.length === 3;
    }
  }, [completions, gameType]);

  const handleClick = useCallback(() => {
    onClick && onClick(activity);
  }, [activity, onClick]);

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
          {isCompleted ? (
            <BaseIcon
              className='text-green-500'
              name='check-circle'
              size={28}
              weight='bold'
            />
          ) : (
            <BaseIcon
              className='text-accent/40'
              name='x-circle'
              size={28}
              weight='bold'
            />
          )}
          <span>
            Activity {orderNumber} - {title}
          </span>
        </div>
        <div className='flex w-full items-center justify-center gap-x-4 text-primary-hue-purple group-hover:text-white sm:w-auto sm:justify-start'>
          <div className='w-28 text-center text-lg font-medium'>
            {scoreText}
          </div>
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
