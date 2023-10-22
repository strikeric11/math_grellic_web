import { memo, useMemo } from 'react';
import cx from 'classix';

import { convertSecondsToDuration } from '#/utils/time.util';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { ActivityCategoryType, categoryLevel } from '../models/activity.model';
import { TeacherActivitySingleQuestion } from './teacher-activity-single-question.component';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { ActivityCategory } from '../models/activity.model';

type Props = ComponentProps<typeof BaseSurface> & {
  gameType: ActivityCategoryType;
  category: ActivityCategory;
};

export const TeacherActivitySingleCategory = memo(function ({
  className,
  gameType,
  category,
  ...moreProps
}: Props) {
  const [level, questionsCount, randomizeQuestions, typePoint, typeTime] =
    useMemo(
      () => [
        category.level,
        category.visibleQuestionsCount,
        category.randomizeQuestions,
        category.typePoint,
        category.typeTime,
      ],
      [category],
    );

  const questionsCountText = useMemo(
    () =>
      questionsCount > 1 ? `${questionsCount} Items` : `${questionsCount} Item`,
    [questionsCount],
  );

  const typePointDurationText = useMemo(
    () => convertSecondsToDuration(typePoint?.durationSeconds || 0, true),
    [typePoint],
  );

  const typePointPointsPerQuestionText = useMemo(
    () => `${typePoint?.pointsPerQuestion} Pt(s) Per Question`,
    [typePoint],
  );

  const typeTimeCorrectAnswerCountText = useMemo(() => {
    const answerText =
      (typeTime?.correctAnswerCount || 0) > 1 ? 'Answers' : 'Answer';
    return `${
      typeTime?.correctAnswerCount || 0
    } Correct ${answerText} To Finish`;
  }, [typeTime]);

  return (
    <BaseSurface
      className={cx('mx-auto w-full max-w-screen-sm !px-4 !pb-5', className)}
      rounded='sm'
      {...moreProps}
    >
      <div className='flex flex-col gap-2.5'>
        <div className='flex items-center gap-2'>
          <BaseIcon
            name={categoryLevel[level].iconName as IconName}
            size={20}
          />
          <span className='font-bold'>
            {categoryLevel[level].levelName} Level
          </span>
        </div>
        <div className='mb-2.5 flex items-center gap-2.5 text-sm'>
          <BaseChip iconName='list-numbers'>{questionsCountText}</BaseChip>
          <BaseDivider className='!h-6' vertical />
          {gameType === ActivityCategoryType.Point ? (
            <>
              <BaseChip iconName='list-checks'>
                {typePointPointsPerQuestionText}
              </BaseChip>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName='hourglass'>{typePointDurationText}</BaseChip>
            </>
          ) : (
            <BaseChip iconName='list-checks'>
              {typeTimeCorrectAnswerCountText}
            </BaseChip>
          )}
          {randomizeQuestions && (
            <>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName='check-square'>Randomized</BaseChip>
            </>
          )}
        </div>
        <div className='flex w-full flex-col gap-y-4'>
          {category.questions.map((question) => (
            <TeacherActivitySingleQuestion
              key={question.id}
              question={question}
            ></TeacherActivitySingleQuestion>
          ))}
        </div>
      </div>
    </BaseSurface>
  );
});
