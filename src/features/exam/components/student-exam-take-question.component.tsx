import { memo, useCallback, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { StaticMathField } from 'react-mathquill';
import toast from 'react-hot-toast';
import cx from 'classix';

import { alphabet } from '#/utils/string.util';
import { ExActTextType } from '#/core/models/core.model';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import type { ExamQuestion } from '../models/exam.model';
import type { StudentExamFormData } from '../models/exam-form-data.model';

type Props = ComponentProps<typeof BaseSurface> & {
  question: ExamQuestion;
  isExpired?: boolean;
  preview?: boolean;
};

type ControlledProps = Props & UseControllerProps<StudentExamFormData>;

export const StudentExamTakeQuestion = memo(function ({
  className,
  isExpired,
  question,
  preview,
  name,
  control,
  ...moreProps
}: ControlledProps) {
  const {
    field: { value, onChange },
  } = useController<any>({ name, control });

  const [questionText, questionId, questionOrderNumber, choices] = useMemo(
    () => [question.text, question.id, question.orderNumber, question.choices],
    [question],
  );

  const getChoiceLabel = useCallback(
    (index: number) => alphabet[index].toUpperCase(),
    [],
  );

  const isChoiceSelected = useCallback(
    (id: number) => value?.selectedQuestionChoiceId === id,
    [value],
  );

  const handleChange = useCallback(
    (choiceId: number) => () => {
      if (isExpired) {
        toast.error(`Time's up. Please submit exam`);
        return;
      }

      if (isChoiceSelected(choiceId)) {
        onChange(undefined);
        return;
      }

      if (preview) {
        onChange({
          questionId: questionOrderNumber,
          selectedQuestionChoiceId: choiceId,
        });
      } else {
        onChange({ questionId, selectedQuestionChoiceId: choiceId });
      }
    },
    [
      preview,
      isExpired,
      questionId,
      questionOrderNumber,
      onChange,
      isChoiceSelected,
    ],
  );

  return (
    <BaseSurface
      id={`q-${questionOrderNumber}`}
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
      <ol className='flex flex-col items-start rounded-sm'>
        {choices.map(({ orderNumber, id, text, textType }) => (
          <li
            key={`c-${orderNumber}`}
            className='w-full border-b border-accent/20 last:border-b-0'
          >
            <div
              role='button'
              className={cx(
                'group/choice relative flex w-full items-center',
                isExpired && 'cursor-default',
              )}
              onClick={handleChange(preview ? orderNumber : id)}
            >
              {isChoiceSelected(preview ? orderNumber : id) && (
                <div className='z-11 absolute left-0 top-0 flex h-full items-center justify-center px-2.5 text-green-500'>
                  <BaseIcon name='check-fat' weight='fill' size={20} />
                </div>
              )}
              <div
                className={cx(
                  'min-h-[40px] flex-1 pr-5 transition-[padding]',
                  // TODO
                  textType === ExActTextType.Expression ? 'pb-1 pt-2' : 'py-2',
                  isChoiceSelected(preview ? orderNumber : id)
                    ? 'bg-green-100 pl-10'
                    : 'bg-white pl-5',
                  !isExpired && 'group-hover/choice:bg-green-100',
                )}
              >
                <span
                  className={cx(
                    'mr-2.5 font-medium opacity-70',
                    isChoiceSelected(preview ? orderNumber : id) &&
                      'text-green-600',
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
        ))}
      </ol>
    </BaseSurface>
  );
});
