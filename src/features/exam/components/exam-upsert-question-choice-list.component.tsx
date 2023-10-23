import { memo, useCallback, useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import cx from 'classix';

import { alphabet } from '#/utils/string.util';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseControlledMathInput } from '#/base/components/base-math-input.component';

import type { ComponentProps } from 'react';
import type { Control } from 'react-hook-form';
import type { Placement } from '@floating-ui/react';
import type { IconName } from '#/base/models/base.model';
import type {
  ExamQuestionChoiceFormData,
  ExamUpsertFormData,
} from '../models/exam-form-data.model';

type Props = ComponentProps<'div'> & {
  questionIndex: number;
  isCollapsed?: boolean;
};

type ChoiceProps = {
  choice: ExamQuestionChoiceFormData;
  control: Control<ExamUpsertFormData, any>;
  choiceName: string;
  choiceLabel: string;
  onSetAnswer: () => void;
  onSetIsExpression: () => void;
  onRemove: () => void;
};

const Choice = memo(function ({
  choice,
  control,
  choiceName,
  choiceLabel,
  onSetAnswer,
  onSetIsExpression,
  onRemove,
}: ChoiceProps) {
  const isExpression = useMemo(() => choice.isExpression, [choice]);
  const isCorrect = useMemo(() => choice.isCorrect, [choice]);

  const iconButtonProps = useMemo(
    () => ({
      className: cx(
        'mr-3 !h-6 !w-6 opacity-40 hover:opacity-100',
        isCorrect && '!opacity-100',
      ),
      iconProps: {
        weight: 'fill',
        className: isCorrect ? 'text-green-500' : '',
      } as ComponentProps<typeof BaseIconButton>['iconProps'],
    }),
    [isCorrect],
  );

  const rightButtonProps = useMemo(
    () => ({
      name: (isExpression ? 'text-t' : 'function') as IconName,
      isInput: true,
      tooltip: isExpression
        ? 'Switch to normal input'
        : 'Switch to Math Equation input',
      tooltipPlacement: 'left' as Placement,
      onClick: onSetIsExpression,
    }),
    [isExpression, onSetIsExpression],
  );

  return (
    <div className='flex w-full max-w-[578px] items-start'>
      <div className='flex h-12 items-center justify-center'>
        <BaseIconButton
          name='check-fat'
          variant='link'
          size='xs'
          onClick={onSetAnswer}
          {...iconButtonProps}
        />
      </div>
      <div className='flex h-fit flex-1 basis-full items-center gap-x-2.5 overflow-hidden'>
        {isExpression ? (
          <BaseControlledMathInput
            className='flex min-h-[48px] items-center'
            name={choiceName}
            control={control}
            leftContent={
              <div
                className={cx(
                  'absolute left-15px top-1/2 flex w-6 -translate-y-1/2 items-center justify-center text-lg font-medium',
                  isCorrect ? 'text-green-500' : 'text-accent/50',
                )}
              >
                {choiceLabel}
              </div>
            }
            rightButtonProps={rightButtonProps}
            fullWidth
          />
        ) : (
          <BaseControlledInput
            name={choiceName}
            control={control}
            leftContent={
              <div
                className={cx(
                  'absolute left-15px top-1/2 flex w-6 -translate-y-1/2 items-center justify-center text-lg font-medium',
                  isCorrect ? 'text-green-500' : 'text-accent/50',
                )}
              >
                {choiceLabel}
              </div>
            }
            rightButtonProps={rightButtonProps}
            fullWidth
          />
        )}
      </div>
      <BaseIconButton
        name='x-square'
        variant='link'
        className='ml-1'
        onClick={onRemove}
      />
    </div>
  );
});

export const ExamUpsertQuestionChoiceList = memo(function ({
  className,
  questionIndex,
  isCollapsed,
  ...moreProps
}: Props) {
  const { control, getValues, setValue } = useFormContext<ExamUpsertFormData>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `questions.${questionIndex}.choices`,
    keyName: 'key',
  });

  useEffect(() => {
    const sourceChoices = getValues(`questions.${questionIndex}.choices`);

    fields.forEach((_, index) => {
      setValue(`questions.${questionIndex}.choices.${index}`, {
        ...sourceChoices[index],
        orderNumber: index + 1,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, questionIndex]);

  const choices = useWatch({
    control,
    name: `questions.${questionIndex}.choices`,
  });

  const filteredFields = useMemo(
    () => (isCollapsed ? fields.filter((field) => field.isCorrect) : fields),
    [fields, isCollapsed],
  );

  const hasAnswer = useMemo(() => {
    return !!choices.find((choice) => choice.isCorrect);
  }, [choices]);

  const getChoiceName = useCallback(
    (key: string) => {
      const choiceIndex = fields.findIndex((field) => field.key === key);
      return `questions.${questionIndex}.choices.${choiceIndex}.text`;
    },
    [fields, questionIndex],
  );

  const getChoiceLabel = useCallback(
    (key: string) => {
      const choiceIndex = fields.findIndex((field) => field.key === key);
      return alphabet[choiceIndex].toUpperCase();
    },
    [fields],
  );

  const setAnswer = useCallback(
    (key: string) => () => {
      // Set all choice's isCorrect to false first, then set target to true
      choices.forEach((choice, choiceIndex) => {
        update(choiceIndex, { ...choice, isCorrect: false });
      });
      const choiceIndex = fields.findIndex((field) => field.key === key);
      update(choiceIndex, { ...choices[choiceIndex], isCorrect: true });
    },
    [fields, choices, update],
  );

  const setIsExpression = useCallback(
    (key: string, isExpression: boolean) => () => {
      const choiceIndex = fields.findIndex((field) => field.key === key);
      update(choiceIndex, { ...choices[choiceIndex], isExpression });
    },
    [fields, choices, update],
  );

  const handleAppend = useCallback(() => {
    append({ text: '', isExpression: false, isCorrect: false } as any);
  }, [append]);

  const handleRemove = useCallback(
    (key: string) => () => {
      if (fields?.length <= 2) {
        toast.error('Question must have at least 2 choices');
        return;
      }

      const choiceIndex = fields.findIndex((field) => field.key === key);
      remove(choiceIndex);
    },
    [fields, remove],
  );

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      {!isCollapsed ? (
        <span className='mb-2 block text-center text-sm font-medium'>
          Choices
        </span>
      ) : (
        !hasAnswer && (
          <span className='mb-2 block text-center text-sm font-medium'>
            No Answer Selected
          </span>
        )
      )}
      <div className='flex w-full flex-col items-center gap-y-2.5'>
        {filteredFields.map(({ key, ...moreFields }) => (
          <Choice
            key={key}
            choice={moreFields}
            control={control}
            choiceName={getChoiceName(key)}
            choiceLabel={getChoiceLabel(key)}
            onSetAnswer={setAnswer(key)}
            onSetIsExpression={setIsExpression(key, !moreFields.isExpression)}
            onRemove={handleRemove(key)}
          />
        ))}
        {!isCollapsed && (
          <BaseButton
            className='group/append w-full overflow-hidden rounded bg-transparent py-2 !transition-[background] hover:bg-primary'
            variant='link'
            size='sm'
            onClick={handleAppend}
          >
            <BaseIcon
              name='plus-circle'
              size='24'
              className='group-hover/append:!text-white'
            />
          </BaseButton>
        )}
      </div>
    </div>
  );
});
