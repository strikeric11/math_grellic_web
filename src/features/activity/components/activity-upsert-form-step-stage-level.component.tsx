import { memo, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import cx from 'classix';

import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseControlledCheckbox } from '#/base/components/base-checkbox.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { ActivityUpsertStageList } from './activity-upsert-stage-list.component';

import type { ComponentProps } from 'react';
import type { ActivityUpsertFormData } from '../models/activity-form-data.model';

type Props = ComponentProps<'div'> & {
  categoryIndex: number;
  disabled?: boolean;
};

const FIXED_FIELD_CLASSNAME = 'flex shrink-0 flex-col items-center gap-y-1';
const FIXED_FIELD_VALUE_CLASSNAME = 'text-2xl font-medium leading-none';

export const ActivityUpsertFormStepStageLevel = memo(function ({
  className,
  categoryIndex,
  disabled,
  ...moreProps
}: Props) {
  const { control, setValue } = useFormContext<ActivityUpsertFormData>();

  const pointsPerQuestion = useWatch({
    control,
    name: `categories.${categoryIndex}.pointsPerQuestion`,
  });

  const stageQuestions = useWatch({
    control,
    name: `categories.${categoryIndex}.stageQuestions`,
  });

  const totalStageCount = useWatch({
    control,
    name: `categories.${categoryIndex}.totalStageCount`,
  });

  const totalQuestionCount = useMemo(
    () =>
      stageQuestions?.reduce(
        (total, stageQuestion) => total + stageQuestion.questions.length,
        0,
      ),
    [stageQuestions],
  );

  useEffect(() => {
    if (pointsPerQuestion != null) {
      return;
    }

    setValue(`categories.${categoryIndex}.pointsPerQuestion`, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <fieldset
        className='group/field flex flex-wrap gap-5'
        disabled={disabled}
      >
        <BaseSurface
          className='flex w-full items-center justify-between gap-5'
          rounded='sm'
        >
          <BaseControlledCheckbox
            labelClassName='mt-0.5 !text-base'
            name={`categories.${categoryIndex}.randomizeQuestions`}
            label='Randomize Questions'
            control={control}
          />
          <div className='flex items-center gap-5'>
            <div className={FIXED_FIELD_CLASSNAME}>
              <span className={FIXED_FIELD_VALUE_CLASSNAME}>
                {totalStageCount}
              </span>
              <small className='uppercase'>Total Levels</small>
            </div>
            <BaseDivider className='!h-10' vertical />
            <div className={FIXED_FIELD_CLASSNAME}>
              <span className={FIXED_FIELD_VALUE_CLASSNAME}>
                {totalQuestionCount}
              </span>
              <small className='uppercase'>Total Questions</small>
            </div>
          </div>
        </BaseSurface>
        <ActivityUpsertStageList categoryIndex={0} />
      </fieldset>
    </div>
  );
});
