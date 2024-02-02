import { memo, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { convertSecondsToDuration } from '#/utils/time.util';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import {
  ActivityCategoryType,
  activityGameLabel,
  categoryLevel,
} from '../models/activity.model';

import { BaseChip } from '#/base/components/base-chip.component';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type {
  Activity,
  ActivityCategory,
  ActivityCategoryLevel,
  ActivityGame,
  Game,
} from '../models/activity.model';

type Props = ComponentProps<typeof BaseSurface> & {
  activity: Activity;
  primary?: boolean;
  isDashboard?: boolean;
};

type ScoreProps = {
  game: Game;
  score: number | null;
};

const ACTIVITY_LIST_PATH = `/${studentBaseRoute}/${studentRoutes.activity.to}`;

const Score = memo(function ({ game, score }: ScoreProps) {
  const scoreSuffix = useMemo(() => {
    const isPlural = (score || 0) > 1;

    if (game.type === ActivityCategoryType.Point) {
      return isPlural ? 'Points' : 'Point';
    } else if (game.type === ActivityCategoryType.Time) {
      return isPlural ? 'Seconds' : 'Second';
    } else {
      return isPlural ? 'Levels' : 'Level';
    }
  }, [game, score]);

  return (
    <div className='flex h-[130px] w-full items-center justify-center overflow-hidden rounded border border-primary-hue-teal-dark bg-primary-hue-teal-dark sm:w-[160px]'>
      {score == null ? (
        <div className='flex h-full w-full items-center justify-center bg-primary-hue-teal-focus'>
          {/* TODO image */}
          <BaseIcon name='game-controller' size={40} weight='light' />
        </div>
      ) : (
        <div className='flex h-full w-full flex-1 flex-col justify-start text-white'>
          <div className='flex h-full flex-1 items-center justify-center bg-primary-hue-teal-focus text-6xl font-medium'>
            {score}
          </div>
          <small className='py-1 text-center font-medium uppercase'>
            {scoreSuffix}
          </small>
        </div>
      )}
    </div>
  );
});

export const StudentActivitySingleCard = memo(function ({
  className,
  activity,
  primary,
  isDashboard,
  ...moreProps
}: Props) {
  const [singleTo, orderNumber, title, game, categories, score] = useMemo(
    () => [
      `${ACTIVITY_LIST_PATH}/${activity.slug}`,
      activity.orderNumber,
      activity.title,
      activity.game,
      activity.categories,
      activity.score != null ? activity.score : null,
    ],
    [activity],
  );

  const gameName = useMemo(
    () => activityGameLabel[game.name as ActivityGame],
    [game],
  );

  const isGameTypeStage = useMemo(
    () => game.type === ActivityCategoryType.Stage,
    [game],
  );

  const getCategoryValue = useCallback(
    (category: ActivityCategory) => {
      if (game.type === ActivityCategoryType.Point) {
        const durationText = convertSecondsToDuration(
          category.typePoint?.durationSeconds || 0,
          true,
        );
        return `${durationText}`;
      } else {
        const answerText =
          (category.typeTime?.correctAnswerCount || 0) > 1 ? 'Points' : 'Point';
        return `${category.typeTime?.correctAnswerCount} ${answerText}`;
      }
    },
    [game],
  );

  const getLevelIconName = useCallback(
    (level: ActivityCategoryLevel) => categoryLevel[level].iconName as IconName,
    [],
  );

  const getLevelName = useCallback(
    (level: ActivityCategoryLevel) => categoryLevel[level].levelName,
    [],
  );

  const generateStageText = useCallback((category: ActivityCategory) => {
    const totalStageCount = category.typeStage?.totalStageCount || 0;
    return `${totalStageCount} ${totalStageCount > 1 ? 'Levels' : 'Level'}`;
  }, []);

  const generateStageQuestionCountText = useCallback(
    (category: ActivityCategory) => {
      const visibleQuestionsCount = category.visibleQuestionsCount;
      return `${visibleQuestionsCount} ${
        visibleQuestionsCount > 1 ? 'Questions' : 'Question'
      }`;
    },
    [],
  );

  return (
    <Link to={singleTo} className='group'>
      <BaseSurface
        className={cx(
          'flex w-full flex-col gap-2.5 !py-2.5 !pl-2.5 !pr-2.5 transition-all group-hover:-translate-y-1 group-hover:ring-1 sm:!pr-5',
          primary
            ? 'primary !border-accent !bg-primary-hue-teal group-hover:!border-primary-hue-teal-focus group-hover:ring-primary-hue-teal-focus group-hover:drop-shadow-primary'
            : 'group-hover:ring-primary-hue-teal-focus group-hover:drop-shadow-primary',
          className,
        )}
        rounded='sm'
        {...moreProps}
      >
        <div className='flex w-full flex-col items-stretch gap-4 sm:flex-row'>
          <Score game={game} score={score} />
          <div
            className={cx(
              'flex flex-1 flex-col justify-between gap-2.5 sm:gap-0',
              isGameTypeStage && 'pb-2.5',
            )}
          >
            {/* Title and status */}
            <div className='flex min-h-[44px] w-full items-center'>
              <h2 className='flex-1 font-body text-lg font-medium tracking-normal text-accent [.primary_&]:text-white'>
                {title}
              </h2>
              {/* status */}
              <div className='flex w-20 justify-center'>
                {score == null ? (
                  <BaseIcon
                    name='circle-dashed'
                    size={44}
                    className='text-accent/50 [.primary_&]:text-white/60'
                  />
                ) : (
                  <div className='relative flex items-center justify-center'>
                    <BaseIcon
                      name='check-circle'
                      weight='fill'
                      className='relative z-10 text-green-500'
                      size={44}
                    />
                    <div className='absolute h-6 w-6 bg-white' />
                  </div>
                )}
              </div>
            </div>
            {/* Info */}
            <div className='flex flex-col items-start justify-between gap-5 -2xs:flex-row -2xs:gap-0'>
              <div className='gap-1 [.primary_&]:text-white'>
                <BaseChip iconName='game-controller'>
                  Activity {orderNumber}
                </BaseChip>
                <BaseChip iconName='dice-three'>{gameName}</BaseChip>
              </div>
              <div
                className={cx(
                  'gap-1 [.primary_&]:text-white',
                  isDashboard
                    ? 'w-[150px] -2lg:w-[200px] xl:w-[150px] 2xl:w-[200px]'
                    : 'w-[200px]',
                )}
              >
                {categories.map((category, index) => (
                  <div
                    key={`cat-${index}`}
                    className='flex items-center gap-2.5'
                  >
                    {!isGameTypeStage ? (
                      <>
                        <BaseChip iconName={getLevelIconName(category.level)}>
                          {getCategoryValue(category)}
                        </BaseChip>
                        <span className='text-sm uppercase'>
                          ({getLevelName(category.level)})
                        </span>
                      </>
                    ) : (
                      <div>
                        <BaseChip iconName='stack'>
                          {generateStageText(category)}
                        </BaseChip>
                        <BaseChip iconName='list-bullets'>
                          {generateStageQuestionCountText(category)}
                        </BaseChip>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BaseSurface>
    </Link>
  );
});

export const StudentActivitySingleCardSkeleton = memo(function () {
  return (
    <div className='flex w-full animate-pulse flex-col items-center justify-between gap-4 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-5 sm:flex-row'>
      <div className='h-[130px] w-full rounded bg-accent/20 sm:w-[160px]' />
      <div className='flex h-fit w-full flex-1 flex-col gap-4'>
        <div className='h-6 w-[200px] rounded bg-accent/20' />
        <div className='flex items-center justify-between gap-2.5'>
          <div className='flex flex-col gap-y-1.5'>
            <div className='h-6 w-40 rounded bg-accent/20' />
            <div className='h-6 w-40 rounded bg-accent/20' />
            <div className='h-6 w-40 rounded bg-accent/20' />
          </div>
          <div className='flex w-[200px] flex-col gap-y-1.5'>
            <div className='h-6 w-full rounded bg-accent/20' />
            <div className='h-6 w-full rounded bg-accent/20' />
            <div className='h-6 w-full rounded bg-accent/20' />
          </div>
        </div>
      </div>
    </div>
  );
});
