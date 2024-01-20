import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import cx from 'classix';

import { liAnimation } from '#/utils/animation.util';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { createDefaultStageQuestion } from '../helpers/activity-form.helper';
import { ActivityGame } from '../models/activity.model';
import { ActivityUpsertStageQuestion } from './activity-upsert-stage-question.component';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type {
  ActivityCategoryQuestionFormData,
  ActivityUpsertFormData,
} from '../models/activity-form-data.model';

type Props = ComponentProps<'div'> & {
  categoryIndex: number;
};

type StageQuestionListProps = ComponentProps<'div'> & {
  categoryIndex: number;
  stageIndex: number;
  onStageRemove: () => void;
};

const StageQuestionList = memo(function ({
  categoryIndex,
  stageIndex,
  onStageRemove,
}: StageQuestionListProps) {
  const setExActImageEdit = useBoundStore((state) => state.setExActImageEdit);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const stageNumber = useMemo(() => stageIndex + 1, [stageIndex]);

  const { control, getValues, setValue } =
    useFormContext<ActivityUpsertFormData>();

  const {
    fields: questions,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: `categories.${categoryIndex}.stageQuestions.${stageIndex}.questions`,
    keyName: 'key',
  });

  const gameName = useWatch({ control, name: 'game.name' });

  const isEscapeRoom = useMemo(
    () => gameName === ActivityGame.EscapeRoom,
    [gameName],
  );

  const totalStageQuestionCountText = useMemo(() => {
    const count = questions.length;
    const questionText = count > 1 ? 'Items' : 'Item';
    return `${count} ${questionText}`;
  }, [questions]);

  const handleIsCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const handleAppend = useCallback(() => {
    setIsCollapsed(false);
    append(createDefaultStageQuestion(stageNumber));
  }, [stageNumber, append]);

  const handleRemove = useCallback(
    (index: number) => () => {
      if (questions.length <= 1) {
        toast.error('Level must have at least 1 question');
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

  useEffect(() => {
    const stageQuestions = getValues(
      `categories.${categoryIndex}.stageQuestions`,
    );

    const sourceQuestions = getValues(
      `categories.${categoryIndex}.stageQuestions.${stageIndex}.questions`,
    );

    questions.forEach((_, index) => {
      const targetQuestion = (
        sourceQuestions ? sourceQuestions[index] : {}
      ) as ActivityCategoryQuestionFormData;

      setValue(
        `categories.${categoryIndex}.stageQuestions.${stageIndex}.questions.${index}`,
        {
          ...targetQuestion,
          orderNumber: index + 1,
          stageNumber,
        },
      );
    });

    const totalQuestionCount = stageQuestions?.reduce(
      (total, stageQuestion) => total + stageQuestion.questions.length,
      0,
    );

    setValue(
      `categories.${categoryIndex}.visibleQuestionsCount`,
      totalQuestionCount,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  const handleUploadChange = useCallback(
    (index: number) => (file: any) => {
      setExActImageEdit({
        index,
        sIndex: stageIndex,
        file,
      });
    },
    [stageIndex, setExActImageEdit],
  );

  return (
    <BaseSurface
      key={`stage-${stageIndex}`}
      className={cx(
        'w-full overflow-hidden !px-0  !pt-1',
        !isEscapeRoom ? '!pb-0' : '!pb-2.5',
      )}
      rounded='sm'
    >
      <div className='mb-2.5 flex w-full items-center justify-between border-b border-b-accent/20 px-2.5'>
        <div className='flex items-center gap-2.5'>
          <div className='flex h-input items-center justify-center'>
            <BaseIconButton
              name={(isCollapsed ? 'caret-right' : 'caret-down') as IconName}
              variant='link'
              size='xs'
              onClick={handleIsCollapsed}
            />
          </div>
          <div className='flex items-center gap-2.5'>
            <span className='text-xl font-medium uppercase text-accent/50'>
              Lv. {stageNumber.toString().padStart(2, '0')}
            </span>
            <BaseDivider className='!h-6' vertical />
            <span className='text-base'>{totalStageQuestionCountText}</span>
          </div>
        </div>
        <div className='flex h-input items-center justify-center'>
          <BaseIconButton
            name='x'
            variant='link'
            size='xs'
            onClick={onStageRemove}
          />
        </div>
      </div>
      <ul
        className={cx(
          'flex w-full flex-col items-center justify-start gap-y-2.5 px-2.5',
          isCollapsed && '!h-0 opacity-0',
        )}
      >
        {questions.map((field, index) => (
          <motion.li
            key={field.key}
            className='w-full'
            transition={liAnimation}
            layout
          >
            <ActivityUpsertStageQuestion
              index={index}
              categoryIndex={categoryIndex}
              stageIndex={stageIndex}
              onRemove={handleRemove(index)}
              onMoveUp={handleMove(index, true)}
              onMoveDown={handleMove(index, false)}
              onUploadChange={handleUploadChange(index)}
              moveUpDisabled={index <= 0}
              moveDownDisabled={index >= questions.length - 1}
            />
          </motion.li>
        ))}
      </ul>
      {!isEscapeRoom && (
        <div className='p-2.5'>
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
      )}
    </BaseSurface>
  );
});

export const ActivityUpsertStageQuestionList = memo(function ({
  className,
  categoryIndex,
  ...moreProps
}: Props) {
  const { control, setValue, getValues } =
    useFormContext<ActivityUpsertFormData>();

  const {
    fields: stageQuestions,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `categories.${categoryIndex}.stageQuestions`,
    keyName: 'key',
  });

  const handleAppend = useCallback(() => {
    const sq = getValues(`categories.${categoryIndex}.stageQuestions`);
    append({
      questions: [createDefaultStageQuestion(sq?.length || 1)],
    });
  }, [categoryIndex, append, getValues]);

  const handleRemove = useCallback(
    (index: number) => () => {
      if (stageQuestions.length <= 1) {
        toast.error('Game must have at least 1 level');
        return;
      }

      remove(index);
    },
    [stageQuestions, remove],
  );

  useEffect(() => {
    setValue(
      `categories.${categoryIndex}.totalStageCount`,
      stageQuestions.length,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageQuestions]);

  return (
    <div
      className={cx('flex w-full flex-col justify-center gap-4', className)}
      {...moreProps}
    >
      {stageQuestions.map((field, index) => (
        <Fragment key={field.key}>
          <StageQuestionList
            categoryIndex={categoryIndex}
            stageIndex={index}
            onStageRemove={handleRemove(index)}
          />
          {index !== stageQuestions.length - 1 && <BaseDivider />}
        </Fragment>
      ))}
      <BaseButton
        className='w-full overflow-hidden rounded bg-transparent py-2 !transition-[background] hover:bg-primary hover:text-white'
        leftIconName='plus-circle'
        variant='link'
        size='sm'
        onClick={handleAppend}
      >
        Add Level
      </BaseButton>
    </div>
  );
});
