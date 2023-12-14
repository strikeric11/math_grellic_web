import { memo, useCallback, useMemo } from 'react';
import { StaticMathField } from 'react-mathquill';
import cx from 'classix';

import { alphabet } from '#/utils/string.util';
import { ExActTextType } from '#/core/models/core.model';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { ExamQuestion, ExamQuestionChoice } from '../models/exam.model';

type Props = ComponentProps<typeof BaseSurface> & {
  question: ExamQuestion;
  selectedChoiceId?: number;
};

type ChoiceProps = {
  className?: string;
  choice?: ExamQuestionChoice;
};

const Choice = memo(function ({ className, choice }: ChoiceProps) {
  const { orderNumber, text, textType, isCorrect } = useMemo(
    () => choice || ({} as ExamQuestionChoice),
    [choice],
  );

  const getChoiceLabel = useCallback(
    (index: number) => alphabet[index].toUpperCase(),
    [],
  );

  return (
    <div
      className={cx(
        'flex w-full items-center',
        isCorrect ? 'bg-green-100' : 'bg-red-100',
        className,
      )}
    >
      {!choice ? (
        <>
          <div className='h-full px-2.5 text-red-500'>
            <BaseIcon name='x-circle' size={28} weight='bold' />
          </div>
          <div className='min-h-[40px] flex-1 py-2 pr-5'>
            <span className='text-accent/80'>None selected</span>
          </div>
        </>
      ) : (
        <>
          <div
            className={cx(
              'h-full px-2.5',
              isCorrect ? 'text-green-500' : 'text-red-500',
            )}
          >
            {isCorrect ? (
              <BaseIcon name='check-circle' size={28} weight='bold' />
            ) : (
              <BaseIcon name='x-circle' size={28} weight='bold' />
            )}
          </div>
          <div
            className={cx(
              'min-h-[40px] flex-1 pr-5',
              // TODO
              textType === ExActTextType.Expression ? 'pb-1 pt-2' : 'py-2',
            )}
          >
            <span className='mr-2.5 font-medium opacity-70'>
              {getChoiceLabel(orderNumber - 1)}.
            </span>
            {/* TODO */}
            {textType === ExActTextType.Expression ? (
              <StaticMathField>{text}</StaticMathField>
            ) : (
              <span>{text}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
});

export const StudentExamQuestionAnswer = memo(function ({
  className,
  question,
  selectedChoiceId,
  ...moreProps
}: Props) {
  const [questionOrderNumber, questionText, choices, selectedChoice] = useMemo(
    () => [
      question.orderNumber,
      question.text,
      question.choices,
      question.choices.find((c) => c.id === selectedChoiceId),
    ],
    [question, selectedChoiceId],
  );

  const answerChoice = useMemo(() => {
    if (selectedChoice?.isCorrect) {
      return null;
    }

    return choices.find((c) => c.isCorrect);
  }, [selectedChoice, choices]);

  return (
    <BaseSurface
      className={cx('w-full overflow-hidden !p-0', className)}
      rounded='sm'
      {...moreProps}
    >
      <p className='border-b border-accent/20 p-4'>
        <span className='pr-2.5 font-medium opacity-70'>
          {questionOrderNumber.toString().padStart(2, '0')}.
        </span>
        {questionText}
      </p>
      <div className='flex flex-col items-start rounded-sm'>
        <Choice choice={selectedChoice} />
        {answerChoice && <Choice className='!bg-white' choice={answerChoice} />}
      </div>
    </BaseSurface>
  );
});
