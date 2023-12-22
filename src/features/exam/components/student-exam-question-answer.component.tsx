import { memo, useCallback, useMemo } from 'react';
import { StaticMathField } from 'react-mathquill';
import cx from 'classix';

import { alphabet } from '#/utils/string.util';
import { getQuestionImageUrl } from '#/base/helpers/base.helper';
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

  const textComponent = useMemo(() => {
    const value =
      textType === ExActTextType.Image ? getQuestionImageUrl(text) : text;

    switch (textType) {
      case ExActTextType.Text:
        return <span>{value}</span>;
      case ExActTextType.Expression:
        return <StaticMathField>{value}</StaticMathField>;
      default:
        return (
          <img
            src={value}
            className='overflow-hidden rounded border border-primary-border-light object-contain'
          />
        );
    }
  }, [text, textType]);

  const getChoiceLabel = useCallback(
    (index: number) => alphabet[index].toUpperCase(),
    [],
  );

  return (
    <div
      className={cx(
        'flex w-full items-start',
        isCorrect ? 'bg-green-100' : 'bg-red-100',
        className,
      )}
    >
      {!choice ? (
        <>
          <div className='h-full px-2.5 py-2 text-red-500'>
            <BaseIcon name='x-circle' size={28} weight='bold' />
          </div>
          <div className='min-h-[40px] flex-1 py-2.5 pr-5'>
            <span className='text-accent/80'>None selected</span>
          </div>
        </>
      ) : (
        <>
          <div
            className={cx(
              'h-full py-2 pl-3 pr-3.5',
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
              'flex min-h-[40px] flex-1 py-2.5 pr-5',
              textType === ExActTextType.Image ? 'items-start' : 'items-center',
              textType === ExActTextType.Expression ? 'pb-1 pt-2' : 'py-2',
            )}
          >
            <span
              className={cx(
                'mr-1 inline-block w-6 text-left font-medium opacity-70',
                isCorrect ? 'text-green-600' : 'text-red-600',
              )}
            >
              {getChoiceLabel(orderNumber - 1)}.
            </span>
            {textComponent}
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
  const [orderNumber, text, isImage, choices, selectedChoice] = useMemo(
    () => [
      question.orderNumber,
      question.textType === ExActTextType.Image
        ? getQuestionImageUrl(question.text)
        : question.text,
      question.textType === ExActTextType.Image,
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
      <div
        className={cx(
          'flex gap-x-1 border-b border-accent/20 px-4',
          isImage ? 'items-start' : 'items-center',
        )}
      >
        <span className='py-[18px] pr-2.5 font-medium opacity-70'>
          {orderNumber.toString().padStart(2, '0')}.
        </span>
        {!isImage ? (
          <span>{text}</span>
        ) : (
          <div className='py-2.5'>
            <img
              src={text}
              className='overflow-hidden rounded border border-primary-border-light object-contain'
            />
          </div>
        )}
      </div>
      <div className='flex flex-col items-start rounded-sm'>
        <Choice choice={selectedChoice} />
        {answerChoice && <Choice className='!bg-white' choice={answerChoice} />}
      </div>
    </BaseSurface>
  );
});
