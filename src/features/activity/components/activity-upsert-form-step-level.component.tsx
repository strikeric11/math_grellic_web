import { memo, useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import cx from 'classix';

import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseTooltip } from '#/base/components/base-tooltip.component';
import { BaseControlledNumberInput } from '#/base/components/base-input.component';
import { BaseControlledCheckbox } from '#/base/components/base-checkbox.component';
import { BaseControlledDurationInput } from '#/base/components/base-duration-input.component';
import { ActivityCategoryType } from '../models/activity.model';
import { ActivityUpsertQuestionList } from './activity-upsert-question-list.component';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { ActivityUpsertFormData } from '../models/activity-form-data.model';

type Props = ComponentProps<'div'> & {
  categoryIndex: number;
  disabled?: boolean;
};

const FIXED_FIELD_CLASSNAME = 'flex shrink-0 flex-col items-center gap-y-1';
const FIXED_FIELD_VALUE_CLASSNAME = 'text-2xl font-bold leading-none';

export const ActivityUpsertFormLevel = memo(function ({
  className,
  categoryIndex,
  disabled,
  ...moreProps
}: Props) {
  const { control, setValue } = useFormContext<ActivityUpsertFormData>();

  const game = useWatch({ control, name: 'game' });

  const visibleQuestionsCount = useWatch({
    control,
    name: `categories.${categoryIndex}.visibleQuestionsCount`,
  });

  const pointsPerQuestion = useWatch({
    control,
    name: `categories.${categoryIndex}.pointsPerQuestion`,
  });

  const questions = useWatch({
    control,
    name: `categories.${categoryIndex}.questions`,
  });

  const totalQuestionCount = useMemo(() => questions?.length || 0, [questions]);

  const totalPoints = useMemo(() => {
    const value =
      visibleQuestionsCount == null
        ? totalQuestionCount
        : visibleQuestionsCount;
    const visibleCount = Math.max(0, Math.min(value, totalQuestionCount));

    return visibleCount * (pointsPerQuestion || 0);
  }, [visibleQuestionsCount, pointsPerQuestion, totalQuestionCount]);

  const handleSetToMax = useCallback(() => {
    setValue(
      `categories.${categoryIndex}.correctAnswerCount`,
      totalQuestionCount,
    );
  }, [categoryIndex, totalQuestionCount, setValue]);

  const setToMaxButtonProps = useMemo(
    () => ({
      name: 'arrows-square-up' as IconName,
      isInput: true,
      tooltip: 'Set to max',
      iconProps: { size: 28 },
      onClick: handleSetToMax,
    }),
    [handleSetToMax],
  );

  useEffect(() => {
    if (pointsPerQuestion != null) {
      return;
    }

    setValue(`categories.${categoryIndex}.pointsPerQuestion`, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!game?.type) {
    return (
      <div
        className={cx('flex w-full justify-center', className)}
        {...moreProps}
      >
        <span>No game selected</span>
      </div>
    );
  }

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <fieldset
        className='group/field flex flex-wrap gap-5'
        disabled={disabled}
      >
        <BaseSurface
          className='flex w-full items-center justify-center gap-5'
          rounded='sm'
        >
          {game?.type === ActivityCategoryType.Time && (
            <div className='flex items-center gap-x-4'>
              <BaseControlledNumberInput
                label='Correct answer count'
                name={`categories.${categoryIndex}.correctAnswerCount`}
                control={control}
                rightButtonProps={setToMaxButtonProps}
                asterisk
              />
              <BaseTooltip content='Number of correct answers needed to finish the level'>
                <BaseIcon name='question' size={30} />
              </BaseTooltip>
            </div>
          )}
          <div
            className={cx(
              FIXED_FIELD_CLASSNAME,
              game?.type === ActivityCategoryType.Time && 'flex-1',
            )}
          >
            <span className={FIXED_FIELD_VALUE_CLASSNAME}>
              {totalQuestionCount}
            </span>
            <small className='uppercase'>Total Questions</small>
          </div>
          {game?.type === ActivityCategoryType.Point && (
            <>
              <BaseIcon
                className='w-11 shrink-0 opacity-40'
                name='x'
                size={28}
              />
              <BaseControlledNumberInput
                label='Points per Question'
                name={`categories.${categoryIndex}.pointsPerQuestion`}
                control={control}
                asterisk
              />
              <BaseIcon
                className='w-11 shrink-0 opacity-40'
                name='equals'
                size={32}
              />
              <div className={FIXED_FIELD_CLASSNAME}>
                <span className={FIXED_FIELD_VALUE_CLASSNAME}>
                  {totalPoints}
                </span>
                <small className='uppercase'>Total Points</small>
              </div>
            </>
          )}
        </BaseSurface>
        <BaseSurface
          className='flex w-full items-center justify-between gap-5'
          rounded='sm'
        >
          {game?.type === ActivityCategoryType.Point && (
            <BaseControlledDurationInput
              label='Level Duration (hh:mm:ss)'
              name={`categories.${categoryIndex}.duration`}
              control={control}
              asterisk
            />
          )}
          <BaseControlledCheckbox
            labelClassName='mt-0.5 !text-base'
            name={`categories.${categoryIndex}.randomizeQuestions`}
            label='Randomize Questions'
            control={control}
          />
        </BaseSurface>
        <ActivityUpsertQuestionList categoryIndex={categoryIndex} />
      </fieldset>
    </div>
  );
});
