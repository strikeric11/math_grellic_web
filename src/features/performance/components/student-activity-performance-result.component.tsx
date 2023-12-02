import { memo, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { transformToActivity } from '#/activity/helpers/activity-transform.helper';
import {
  ActivityCategoryLevel,
  ActivityCategoryType,
} from '#/activity/models/activity.model';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { getStudentActivityWithCompletionsBySlugAndCurrentStudentUser } from '../api/student-performance.api';

import type { ComponentProps } from 'react';
import type { ActivityCategory } from '#/activity/models/activity.model';

type Props = ComponentProps<'div'> & {
  slug: string;
};

type ResultProps = {
  categories: ActivityCategory[];
  gameType?: string;
};

const Result = memo(function ({ gameType, categories }: ResultProps) {
  const completions = useMemo(() => {
    if (gameType === ActivityCategoryType.Stage) {
      const score =
        categories.length && categories[0].completions?.length
          ? categories[0]?.completions[0]?.score
          : null;

      return score
        ? [{ score, scoreSuffix: score > 1 ? 'Levels' : 'Level' }]
        : [{ score: null, scoreSuffix: '-' }];
    } else if (gameType === ActivityCategoryType.Point) {
      const getScore = (level: ActivityCategoryLevel) => {
        const cat = categories.find((cat) => cat.level === level);

        const score = cat?.completions?.length
          ? cat.completions[0].score
          : null;

        if (!score) {
          return { score: null, scoreSuffix: '-' };
        }

        return { score, scoreSuffix: score > 1 ? 'Points' : 'Point' };
      };

      const easyScore = getScore(ActivityCategoryLevel.Easy);
      const averageScore = getScore(ActivityCategoryLevel.Average);
      const difficultScore = getScore(ActivityCategoryLevel.Difficult);

      return [easyScore, averageScore, difficultScore];
    } else {
      const getTimeCompleted = (level: ActivityCategoryLevel) => {
        const cat = categories.find((cat) => cat.level === level);

        const timeCompleted = cat?.completions?.length
          ? cat.completions[0].timeCompletedSeconds
          : null;

        if (!timeCompleted) {
          return { score: null, scoreSuffix: '-' };
        }

        return {
          score: timeCompleted,
          scoreSuffix: timeCompleted > 1 ? 'Seconds' : 'Second',
        };
      };

      const easyTimeCompleted = getTimeCompleted(ActivityCategoryLevel.Easy);
      const averageTimeCompleted = getTimeCompleted(
        ActivityCategoryLevel.Average,
      );
      const difficultTimeCompleted = getTimeCompleted(
        ActivityCategoryLevel.Difficult,
      );

      return [easyTimeCompleted, averageTimeCompleted, difficultTimeCompleted];
    }
  }, [gameType, categories]);

  if (gameType === ActivityCategoryType.Stage) {
    return <div>{!!completions.length && completions[0].score}</div>;
  }

  return (
    <div>
      <ul className='flex flex-col gap-2.5'>
        {completions.map(({ score, scoreSuffix }, index) => (
          <div className='flex items-center justify-between gap-5'>
            <div className='flex items-center gap-x-2.5'>
              {score ? (
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
              <span>{ActivityCategoryLevel[index + 1]} Level</span>
            </div>
            <span className='inline-block min-w-[32px]'>
              {score ? `${score} ${scoreSuffix}` : scoreSuffix}
            </span>
          </div>
        ))}
      </ul>
    </div>
  );
});

export const StudentActivityPerformanceResult = memo(function ({
  slug,
  ...moreProps
}: Props) {
  const {
    data: activity,
    isFetching,
    isLoading,
  } = useQuery(
    getStudentActivityWithCompletionsBySlugAndCurrentStudentUser(
      { slug },
      {
        refetchOnWindowFocus: false,
        enabled: !!slug,
        select: (data: unknown) => transformToActivity(data),
      },
    ),
  );

  const [title, gameType, categories] = useMemo(
    () => [activity?.title, activity?.game.type, activity?.categories],
    [activity],
  );

  const label = useMemo(() => (title ? `Results for ${title}` : ''), [title]);

  const hasCompletions = useMemo(
    () => !!categories?.some((cat) => cat.completions?.length),
    [categories],
  );

  if (isFetching || isLoading) {
    return (
      <div className='mt-5 flex w-full justify-center'>
        <BaseSpinner />
      </div>
    );
  }

  return (
    <div {...moreProps}>
      {hasCompletions ? (
        <>
          <div className='mb-2.5'>{label}</div>
          <Result gameType={gameType} categories={categories || []} />
        </>
      ) : (
        <div className='w-full pt-4 text-center'>Nothing to show</div>
      )}
    </div>
  );
});
