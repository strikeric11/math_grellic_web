import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.components';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseTooltip } from '#/base/components/base-tooltip.component';
import { BaseControlledTextArea } from '#/base/components/base-textarea.component';
import { defaultQuestion } from '../helpers/exam-form.helper';
import { ExamUpsertQuestionChoiceList } from './exam-upsert-question-choice-list.component';

import type { ComponentProps } from 'react';
import type { Control } from 'react-hook-form';
import type { IconName } from '#/base/models/base.model';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

type QuestionProps = {
  index: number;
  control: Control<ExamUpsertFormData, any>;
  onRemove: (index: number) => () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  moveUpDisabled?: boolean;
  moveDownDisabled?: boolean;
};

const liAnimation = {
  type: 'spring',
  damping: 30,
  stiffness: 200,
};

const Question = memo(function ({
  index,
  control,
  onRemove,
  onMoveDown,
  onMoveUp,
  moveUpDisabled,
  moveDownDisabled,
}: QuestionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const orderNumber = useMemo(
    () => (index + 1).toString().padStart(2, '0'),
    [index],
  );

  const handleIsCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <BaseSurface className={cx('w-full !px-0 !pb-2.5 !pt-1')} rounded='sm'>
      <div className='mb-2.5 flex w-full items-center justify-between border-b border-b-accent/20 px-5'>
        <span className='text-xl font-bold text-accent/50'>{orderNumber}</span>
        <div className='flex items-center'>
          <BaseTooltip content='Move Up'>
            <BaseIconButton
              name='arrow-circle-up'
              variant='link'
              className='!w-8'
              disabled={moveUpDisabled}
              onClick={onMoveUp}
            />
          </BaseTooltip>
          <BaseTooltip content='Move Down'>
            <BaseIconButton
              name='arrow-circle-down'
              variant='link'
              className='!w-8'
              disabled={moveDownDisabled}
              onClick={onMoveDown}
            />
          </BaseTooltip>
        </div>
      </div>
      <div className='px-2.5'>
        <div className='flex items-start gap-x-2.5'>
          <div className='flex h-input items-center justify-center'>
            <BaseIconButton
              name={(isCollapsed ? 'caret-right' : 'caret-down') as IconName}
              variant='link'
              size='sm'
              onClick={handleIsCollapsed}
            />
          </div>
          <BaseControlledTextArea
            name={`questions.${index}.text`}
            placeholder='Question'
            control={control}
            fullWidth
          />
          <div className='flex h-input items-center justify-center'>
            <BaseIconButton
              name='x'
              variant='link'
              size='sm'
              onClick={onRemove(index)}
            />
          </div>
        </div>
        <ExamUpsertQuestionChoiceList
          className='mt-4'
          questionIndex={index}
          isCollapsed={isCollapsed}
        />
      </div>
    </BaseSurface>
  );
});

export const ExamUpsertQuestionList = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'div'>) {
  const { control, getValues, setValue } = useFormContext<ExamUpsertFormData>();

  const {
    fields: questions,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: 'questions',
    keyName: 'key',
  });

  useEffect(() => {
    const sourceQuestions = getValues('questions');

    questions.forEach((_, index) => {
      setValue(`questions.${index}`, {
        ...sourceQuestions[index],
        orderNumber: index + 1,
      });
    });

    setValue('visibleQuestionsCount', questions.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  const handleAppend = useCallback(() => {
    append(defaultQuestion);
  }, [append]);

  const handleRemove = useCallback(
    (index: number) => () => {
      if (questions?.length <= 1) {
        toast.error('Exam must have at least 1 question');
        return;
      }

      remove(index);
    },
    [questions, remove],
  );

  const handleMove = useCallback(
    (index: number, isUp: boolean) => () => {
      if (isUp) {
        index > 0 && move(index, index - 1);
      } else {
        index < questions.length - 1 && move(index, index + 1);
      }
    },
    [move, questions],
  );

  return (
    <div
      className={cx(
        'flex w-full flex-col items-center justify-start gap-y-2.5 pb-8',
        className,
      )}
      {...moreProps}
    >
      <ul className='flex w-full flex-col items-center justify-start gap-y-2.5'>
        {questions.map((field, index) => (
          <motion.li
            key={field.key}
            className='w-full'
            transition={liAnimation}
            layout
          >
            <Question
              index={index}
              control={control}
              onRemove={handleRemove}
              onMoveUp={handleMove(index, true)}
              onMoveDown={handleMove(index, false)}
              moveUpDisabled={index <= 0}
              moveDownDisabled={index >= questions.length - 1}
            />
          </motion.li>
        ))}
      </ul>
      <BaseButton
        className='w-full overflow-hidden rounded bg-transparent py-2 !transition-[background] hover:bg-primary hover:text-white'
        leftIconName='plus-circle'
        variant='link'
        size='sm'
        onClick={handleAppend}
      >
        Add Question
      </BaseButton>
    </div>
  );
});
