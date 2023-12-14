import { memo, useCallback, useMemo, useState } from 'react';
import { StaticMathField } from 'react-mathquill';
import cx from 'classix';

import { alphabet } from '#/utils/string.util';
import { ExActTextType } from '#/core/models/core.model';
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
};

const Choice = memo(function ({
  choice: { orderNumber, text, textType, isCorrect },
}: {
  choice: ActivityCategoryQuestionChoice;
}) {
  const getChoiceLabel = useCallback(
    (index: number) => alphabet[index].toUpperCase(),
    [],
  );

  return (
    <li className='w-full border-b border-accent/20 last:border-b-0'>
      <div className='relative flex w-full items-center'>
        {isCorrect && (
          <div className='z-11 absolute left-0 top-0 flex h-full items-center justify-center px-3 text-green-500'>
            <BaseIcon name='check-fat' weight='fill' size={20} />
          </div>
        )}
        <div
          className={cx(
            'min-h-[40px] flex-1 bg-white pr-5 transition-[padding]  group-hover/choice:bg-green-100',
            // TODO
            textType === ExActTextType.Expression ? 'pb-1 pt-2' : 'py-2',
            isCorrect ? 'pl-11' : 'pl-5',
          )}
        >
          <span
            className={cx(
              'mr-2.5 font-medium opacity-70',
              isCorrect && 'text-green-600',
            )}
          >
            {getChoiceLabel(orderNumber - 1)}.
          </span>
          {/* TODO */}
          {textType === ExActTextType.Expression ? (
            <StaticMathField>{text}</StaticMathField>
          ) : (
            <span>{text}</span>
          )}
        </div>
      </div>
    </li>
  );
});

export const TeacherActivitySingleQuestion = memo(function ({
  className,
  question,
  ...moreProps
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [questionText, questionOrderNumber, choices] = useMemo(
    () => [question.text, question.orderNumber, question.choices],
    [question],
  );

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
      <div className='flex items-center gap-x-1 border-b border-accent/20 px-1'>
        <div className='flex h-input items-center justify-center'>
          <BaseIconButton
            name={(isCollapsed ? 'caret-right' : 'caret-down') as IconName}
            variant='link'
            size='sm'
            onClick={handleIsCollapsed}
          />
        </div>
        <p>
          <span className='pr-2.5 font-medium opacity-70'>
            {questionOrderNumber.toString().padStart(2, '0')}.
          </span>
          {questionText}
        </p>
      </div>
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
