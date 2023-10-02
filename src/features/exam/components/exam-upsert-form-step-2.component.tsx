import { memo, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { BaseControlledNumberInput } from '#/base/components/base-input.component';
import { BaseControlledCheckbox } from '#/base/components/base-checkbox.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { ExamUpsertQuestionList } from './exam-upsert-question-list.component';

import type { ExamUpsertFormData } from '../models/exam.model';
import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';

type Props = ComponentProps<'div'> & {
  disabled?: boolean;
};

const FIXED_FIELD_CLASSNAME = 'flex shrink-0 flex-col items-center gap-y-1';
const FIXED_FIELD_VALUE_CLASSNAME = 'text-2xl font-bold leading-none';

const passingPointsWrapperProps = { className: 'max-w-[203px]' };

export const ExamUpsertFormStep2 = memo(function ({
  disabled,
  ...moreProps
}: Props) {
  const { control, watch, setValue } = useFormContext<ExamUpsertFormData>();

  const [visibleQuestionsCount, pointsPerQuestion, questions] = watch([
    'visibleQuestionsCount',
    'pointsPerQuestion',
    'questions',
  ]);

  const totalQuestionCount = useMemo(() => questions?.length || 0, [questions]);

  const totalPoints = useMemo(() => {
    const value = visibleQuestionsCount || 0;
    const visibleCount = Math.max(0, Math.min(value, totalQuestionCount));

    return visibleCount * pointsPerQuestion;
  }, [visibleQuestionsCount, pointsPerQuestion, totalQuestionCount]);

  const setMaxVisibleQuestions = useCallback(() => {
    setValue('visibleQuestionsCount', totalQuestionCount);
  }, [totalQuestionCount, setValue]);

  const visibleQuestionsIconButtonProps = useMemo(
    () => ({
      name: 'arrow-fat-up' as IconName,
      isInput: true,
      tooltip: 'Set to max',
      onClick: setMaxVisibleQuestions,
    }),
    [setMaxVisibleQuestions],
  );

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
          <BaseControlledNumberInput
            label='Visible Questions'
            name='visibleQuestionsCount'
            control={control}
            rightButtonProps={visibleQuestionsIconButtonProps}
            fullWidth
            asterisk
          />
          <BaseIcon className='w-11 shrink-0 opacity-40' name='x' size={28} />
          <div className={FIXED_FIELD_CLASSNAME}>
            <span className={FIXED_FIELD_VALUE_CLASSNAME}>
              {pointsPerQuestion}
            </span>
            <span className='text-sm font-medium'>Pt(s) Per Question</span>
          </div>
          <BaseIcon
            className='w-11 shrink-0 opacity-40'
            name='equals'
            size={32}
          />
          <div className={FIXED_FIELD_CLASSNAME}>
            <span className={FIXED_FIELD_VALUE_CLASSNAME}>{totalPoints}</span>
            <span className='text-sm font-medium'>Total Points</span>
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
          <div className='flex flex-col'>
            <BaseControlledCheckbox
              labelClassName='mt-0.5 !text-base'
              name='randomizeQuestions'
              label='Randomize Questions'
              control={control}
            />
            <div className='text-right'>
              Total Questions:
              <span className='ml-2 text-lg'>{totalQuestionCount}</span>
            </div>
          </div>
        </BaseSurface>
        <ExamUpsertQuestionList />
      </fieldset>
    </div>
  );
});
