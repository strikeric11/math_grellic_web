import { memo } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cx from 'classix';

import { StudentExamQuestionAnswer } from './student-exam-question-answer.component';

import type { ComponentProps } from 'react';
import type { ExamQuestion } from '../models/exam.model';

type QuestionAnswer = {
  question: ExamQuestion | undefined;
  selectedQuestionChoiceId: number;
};

type Props = ComponentProps<'div'> & {
  questionAnswers: QuestionAnswer[];
  label?: string;
};

export const StudentExamQuestionResult = memo(function ({
  className,
  questionAnswers,
  label = 'Showing exam questions with your selected choices and answers.',
  ...moreProps
}: Props) {
  return (
    <div className={cx('h-[450px]', className)} {...moreProps}>
      <OverlayScrollbarsComponent className='h-full w-full px-4 pb-2.5' defer>
        <div className='mb-2.5'>{label}</div>
        <ol className='flex w-full flex-col gap-y-2.5'>
          {questionAnswers.map(
            ({ question, selectedQuestionChoiceId }, index) =>
              question && (
                <li key={`ans-${question.id}`} className='w-full'>
                  <StudentExamQuestionAnswer
                    key={`qa-${index}`}
                    question={question}
                    selectedChoiceId={selectedQuestionChoiceId}
                  />
                </li>
              ),
          )}
        </ol>
      </OverlayScrollbarsComponent>
    </div>
  );
});
