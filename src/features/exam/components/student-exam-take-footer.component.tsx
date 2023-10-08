import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseDivider } from '#/base/components/base-divider.component';

import type { ComponentProps } from 'react';
import type { ExamQuestion } from '../models/exam.model';
import type { ExamAnswerFormData } from '../models/exam-form-data.model';

type Props = ComponentProps<'div'> & {
  questions: ExamQuestion[];
  answers: ExamAnswerFormData[];
  preview?: boolean;
};

export const StudentExamTakeFooter = memo(function ({
  className,
  questions,
  answers,
  preview,
  ...moreProps
}: Props) {
  const miniAnswersProgress = useMemo(
    () =>
      questions.map(({ id, orderNumber }) => {
        const answer = answers
          .filter((a) => a)
          .find(
            ({ questionId }) => questionId === (preview ? orderNumber : id),
          );

        const onClick = () => {
          const element = document.getElementById(`q-${orderNumber}`);
          !!element && element.scrollIntoView({ behavior: 'smooth' });
        };

        return {
          hasAnswer: !!answer?.selectedQuestionChoiceId,
          onClick,
        };
      }),
    [questions, answers, preview],
  );

  const answerCount = useMemo(
    () => answers?.filter((a) => a && !!a.selectedQuestionChoiceId)?.length,
    [answers],
  );

  const questionCount = useMemo(() => questions?.length || 0, [questions]);

  return (
    <div
      className={cx(
        'bg-gradient sticky bottom-0 w-full bg-gradient-to-t from-backdrop from-60% to-transparent pb-3 pt-10',
        className,
      )}
      {...moreProps}
    >
      <div className='flex w-full items-center justify-between'>
        <div className='flex w-full max-w-[414px] flex-wrap items-center gap-x-0.5 overflow-hidden rounded-sm'>
          {miniAnswersProgress.map(({ hasAnswer, onClick }, index) => (
            <button
              key={index}
              type='button'
              className={cx(
                'h-6 w-6 border border-accent/30 transition-colors hover:bg-accent/20',
                hasAnswer ? '!bg-green-500' : 'bg-accent/30',
              )}
              onClick={onClick}
            />
          ))}
        </div>
        <div className='flex items-center gap-x-4 font-medium text-primary'>
          <div className='flex flex-col items-center'>
            <span className='text-xl leading-none'>{answerCount}</span>
            <small className='uppercase opacity-80'>Answered Items</small>
          </div>
          <BaseDivider className='!h-10' vertical />
          <div className='flex flex-col items-center'>
            <span className='text-xl leading-none'>{questionCount}</span>
            <small className='uppercase opacity-80'>Total Items</small>
          </div>
          <BaseDivider className='!h-10' vertical />
          <div className='text-xl'>{preview ? '00:00' : '00:00'}</div>
        </div>
      </div>
    </div>
  );
});
