import { memo, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { BaseSpinner } from '#/base/components/base-spinner.component';
import { transformToExam } from '#/exam/helpers/exam-transform.helper';
import { StudentExamQuestionResult } from '#/exam/components/student-exam-question-result.component';
import { getStudentExamWithCompletionsByPublicIdAndSlug } from '../api/teacher-performance.api';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  slug: string;
};

export const TeacherStudentExamPerformanceResult = memo(function ({
  slug,
  ...moreProps
}: Props) {
  const { publicId } = useParams();

  const {
    data: exam,
    isFetching,
    isLoading,
  } = useQuery(
    getStudentExamWithCompletionsByPublicIdAndSlug(
      { publicId: publicId || '', slug },
      {
        refetchOnWindowFocus: false,
        enabled: !!publicId,
        select: (data: unknown) => transformToExam(data),
      },
    ),
  );

  const [title, questions, examCompletion] = useMemo(
    () => [
      exam?.title,
      exam?.questions || [],
      exam?.completions?.length ? exam.completions[0] : null,
    ],
    [exam],
  );

  const label = useMemo(() => (title ? `Results for ${title}` : ''), [title]);

  const questionAnswers = useMemo(
    () =>
      examCompletion?.questionAnswers?.map((answer) => {
        const question = questions.find((q) => q.id === answer.question.id);
        return {
          question,
          selectedQuestionChoiceId: answer.selectedQuestionChoice.id,
        };
      }) || [],
    [examCompletion, questions],
  );

  if (isFetching || isLoading) {
    return (
      <div className='mt-5 flex w-full justify-center'>
        <BaseSpinner />
      </div>
    );
  }

  return (
    <div {...moreProps}>
      {examCompletion ? (
        <StudentExamQuestionResult
          questionAnswers={questionAnswers}
          label={label}
        />
      ) : (
        <div className='w-full pt-4 text-center'>Nothing to show</div>
      )}
    </div>
  );
});
