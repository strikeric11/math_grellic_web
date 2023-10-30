import { memo, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { BaseControlledNumberInput } from '#/base/components/base-input.component';
import { BaseControlledCheckbox } from '#/base/components/base-checkbox.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { ExamUpsertQuestionList } from './exam-upsert-question-list.component';

import type { ComponentProps } from 'react';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

type Props = ComponentProps<'div'> & {
  disabled?: boolean;
};

const FIXED_FIELD_CLASSNAME = 'flex shrink-0 flex-col items-center gap-y-1';
const FIXED_FIELD_VALUE_CLASSNAME = 'text-2xl font-medium leading-none';

const passingPointsWrapperProps = { className: 'max-w-[203px]' };

export const ExamUpsertFormStep2 = memo(function ({
  disabled,
  ...moreProps
}: Props) {
  const { control } = useFormContext<ExamUpsertFormData>();

  const visibleQuestionsCount = useWatch({
    control,
    name: 'visibleQuestionsCount',
  });
  const pointsPerQuestion = useWatch({ control, name: 'pointsPerQuestion' });
  const questions = useWatch({ control, name: 'questions' });

  const totalQuestionCount = useMemo(() => questions?.length || 0, [questions]);

  const totalPoints = useMemo(() => {
    const value =
      visibleQuestionsCount == null
        ? totalQuestionCount
        : visibleQuestionsCount;
    const visibleCount = Math.max(0, Math.min(value, totalQuestionCount));

    return visibleCount * pointsPerQuestion;
  }, [visibleQuestionsCount, pointsPerQuestion, totalQuestionCount]);

  return (
    <div {...moreProps}>
      <fieldset
        className='group/field flex flex-wrap gap-5'
        disabled={disabled}
      >
        <BaseSurface
          className='flex w-full items-center justify-between gap-5'
          rounded='sm'
        >
          <div className={FIXED_FIELD_CLASSNAME}>
            <span className={FIXED_FIELD_VALUE_CLASSNAME}>
              {totalQuestionCount}
            </span>
            <small className='uppercase'>Total Questions</small>
          </div>
          <BaseIcon className='w-11 shrink-0 opacity-40' name='x' size={28} />
          <div className={FIXED_FIELD_CLASSNAME}>
            <span className={FIXED_FIELD_VALUE_CLASSNAME}>
              {pointsPerQuestion}
            </span>
            <small className='uppercase'>Point Per Question</small>
          </div>
          <BaseIcon
            className='w-11 shrink-0 opacity-40'
            name='equals'
            size={32}
          />
          <div className={FIXED_FIELD_CLASSNAME}>
            <span className={FIXED_FIELD_VALUE_CLASSNAME}>{totalPoints}</span>
            <small className='uppercase'>Total Points</small>
          </div>
        </BaseSurface>
        <BaseSurface
          className='flex w-full items-center justify-between gap-5'
          rounded='sm'
        >
          <BaseControlledNumberInput
            wrapperProps={passingPointsWrapperProps}
            label='Passing Points'
            name='passingPoints'
            control={control}
            fullWidth
            asterisk
          />
          <BaseControlledCheckbox
            labelClassName='mt-0.5 !text-base'
            name='randomizeQuestions'
            label='Randomize Questions'
            control={control}
          />
        </BaseSurface>
        <ExamUpsertQuestionList />
      </fieldset>
    </div>
  );
});
