import { memo, useCallback, useMemo, useState } from 'react';
import { StaticMathField } from 'react-mathquill';
import cx from 'classix';

import { alphabet } from '#/utils/string.util';
import { ExActTextType } from '#/core/models/core.model';
import { getQuestionImageUrl } from '#/base/helpers/base.helper';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type {
  ActivityCategoryQuestion,
  ActivityCategoryQuestionChoice,
} from '../models/activity.model';

type Props = ComponentProps<typeof BaseSurface> & {
  question: ActivityCategoryQuestion;
  withHints?: boolean;
};

const Choice = memo(function ({
  choice: { orderNumber, text, textType, isCorrect },
}: {
  choice: ActivityCategoryQuestionChoice;
}) {
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
    <li className='w-full border-b border-accent/20 last:border-b-0'>
      <div className='relative flex w-full items-center'>
        {isCorrect && (
          <div className='z-11 absolute left-0 top-0 flex h-full items-start justify-center px-3 py-2.5 text-green-500'>
            <BaseIcon name='check-fat' weight='fill' size={20} />
          </div>
        )}
        <div
          className={cx(
            'flex min-h-[40px] flex-1 bg-white pl-10  pr-5 transition-[padding] group-hover/choice:bg-green-100',
            textType === ExActTextType.Image ? 'items-start' : 'items-center',
            textType === ExActTextType.Expression ? 'pb-1 pt-2' : 'py-2',
          )}
        >
          <span
            className={cx(
              'mx-2.5 inline-block w-6 text-left font-medium opacity-70',
              isCorrect && 'text-green-600',
            )}
          >
            {getChoiceLabel(orderNumber - 1)}.
          </span>
          {textComponent}
        </div>
      </div>
    </li>
  );
});

export const TeacherActivitySingleQuestion = memo(function ({
  className,
  withHints,
  question,
  ...moreProps
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [orderNumber, text, isImage, choices, hintText] = useMemo(
    () => [
      question.orderNumber,
      question.textType === ExActTextType.Image
        ? getQuestionImageUrl(question.text)
        : question.text,
      question.textType === ExActTextType.Image,
      question.choices,
      question.hintText,
    ],
    [question],
  );

  const hasHint = useMemo(() => hintText?.trim().length, [hintText]);

  const answer = useMemo(() => choices.find((c) => c.isCorrect), [choices]);

  const handleIsCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <BaseSurface
      className={cx('w-full overflow-hidden !p-0', className)}
      rounded='sm'
      {...moreProps}
    >
      <div
        className={cx(
          'flex gap-x-1 border-b border-accent/20 px-1',
          isImage ? 'items-start' : 'items-center',
        )}
      >
        <div className='flex h-input items-center justify-center'>
          <BaseIconButton
            name={(isCollapsed ? 'caret-right' : 'caret-down') as IconName}
            variant='link'
            size='sm'
            onClick={handleIsCollapsed}
          />
        </div>
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
      {withHints && (
        <div className='border-b border-accent/20 bg-accent/5 px-5 py-2 opacity-70'>
          <span className='py-[18px] pr-2.5 font-medium opacity-70'>
            Hint —
          </span>
          <span className={cx(!hasHint && 'text-sm italic')}>
            {hasHint ? hintText : 'Question has no hint'}
          </span>
        </div>
      )}
      <ol className='flex flex-col items-start rounded-sm'>
        {isCollapsed
          ? answer && <Choice choice={answer} />
          : choices.map((choice) => (
              <Choice key={`c-${choice.id}`} choice={choice} />
            ))}
      </ol>
    </BaseSurface>
  );
});
