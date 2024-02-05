import { memo, useCallback, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { StaticMathField } from 'react-mathquill';
import toast from 'react-hot-toast';
import cx from 'classix';

import { alphabet } from '#/utils/string.util';
import { getQuestionImageUrl } from '#/base/helpers/base.helper';
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

type ChoiceTextProps = {
  text: string;
  textType: ExActTextType;
};

type ControlledProps = Props & UseControllerProps<StudentExamFormData>;

const ChoiceText = memo(function ({ text, textType }: ChoiceTextProps) {
  const value = useMemo(
    () => (textType === ExActTextType.Image ? getQuestionImageUrl(text) : text),
    [textType, text],
  );

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
});

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

  const [questionId, orderNumber, text, isImage, choices] = useMemo(
    () => [
      question.id,
      question.orderNumber,
      question.textType === ExActTextType.Image
        ? getQuestionImageUrl(question.text)
        : question.text,
      question.textType === ExActTextType.Image,
      question.choices,
    ],
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
          questionId: orderNumber,
          selectedQuestionChoiceId: choiceId,
        });
      } else {
        onChange({ questionId, selectedQuestionChoiceId: choiceId });
      }
    },
    [preview, isExpired, questionId, orderNumber, onChange, isChoiceSelected],
  );

  return (
    <BaseSurface
      id={`q-${orderNumber}`}
      className={cx('w-full overflow-hidden !p-0', className)}
      rounded='sm'
      {...moreProps}
    >
      <div
        className={cx(
          'flex flex-col gap-x-1 border-b border-accent/20 px-5 py-2.5 xs:flex-row xs:py-0 xs:pl-5 xs:pr-1',
          isImage ? 'items-start' : 'items-start xs:items-center',
        )}
      >
        <span className='pb-2.5 font-medium opacity-70 xs:py-[18px] xs:pr-2.5'>
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
                <div className='z-11 absolute right-0 top-0 flex h-full items-start justify-center px-3 py-2.5 text-green-500 xs:left-0 xs:right-auto'>
                  <BaseIcon name='check-fat' weight='fill' size={20} />
                </div>
              )}
              <div
                className={cx(
                  'flex min-h-[40px] flex-1 flex-wrap pr-5 transition-[padding] xs:flex-nowrap',
                  textType === ExActTextType.Image
                    ? 'items-start'
                    : 'items-center',
                  textType === ExActTextType.Expression ? 'pb-1 pt-2' : 'py-2',
                  isChoiceSelected(preview ? orderNumber : id)
                    ? 'bg-green-100 pl-5 xs:pl-10'
                    : 'bg-white pl-5',
                  !isExpired && 'group-hover/choice:bg-green-100',
                )}
              >
                <span
                  className={cx(
                    'mb-1 font-medium opacity-70 xs:mb-0 xs:mr-2.5',
                    isChoiceSelected(preview ? orderNumber : id) &&
                      'text-green-600',
                  )}
                >
                  {getChoiceLabel(orderNumber - 1)}.
                </span>
                <div className='w-full'>
                  <ChoiceText text={text} textType={textType} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </BaseSurface>
  );
});
