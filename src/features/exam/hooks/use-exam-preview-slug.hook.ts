import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { transformToExam } from '../helpers/exam-transform.helper';
import { getExamBySlugAndCurrentTeacherUser } from '../api/teacher-exam.api';

import type {
  Exam,
  ExamCompletion,
  ExamCompletionQuestionAnswer,
  ExamQuestionChoice,
} from '../models/exam.model';
import type { StudentExamFormData } from '../models/exam-form-data.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  titlePreview: string;
  submitExam: (data: StudentExamFormData) => Promise<ExamCompletion>;
  exam: Exam | null;
  examCompletion: ExamCompletion | null;
};

export function useExamPreviewSlug(): Result {
  const { slug } = useParams();
  const [isDone, setIsDone] = useState(false);
  const [examCompletion, setExamCompletion] = useState<ExamCompletion | null>(
    null,
  );

  const { data: exam } = useQuery(
    getExamBySlugAndCurrentTeacherUser(
      { slug: slug || '', exclude: 'schedules' },
      {
        enabled: !!slug,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToExam(data);
        },
      },
    ),
  );

  const titlePreview = useMemo(
    () => (exam?.title ? `${exam?.title} (Preview)` : 'Preview'),
    [exam],
  );

  const submitExam = useCallback(
    async (data: StudentExamFormData) => {
      // Since this is a preview use order number instead of question/choice id
      const questionAnswers = data.answers
        .map(({ questionId, selectedQuestionChoiceId }) => {
          const question = exam?.questions.find(
            (q) => q.orderNumber === questionId,
          );
          return {
            question,
            selectedQuestionChoice: { id: selectedQuestionChoiceId },
          };
        })
        .filter((q) => q.question) as ExamCompletionQuestionAnswer[];

      const score = questionAnswers.reduce(
        (total, { question, selectedQuestionChoice }) => {
          const choice = question?.choices.find(
            (c: ExamQuestionChoice) =>
              c.orderNumber === selectedQuestionChoice?.id,
          );

          if (choice && choice.isCorrect) {
            return (exam?.pointsPerQuestion || 0) + total;
          }

          return total;
        },
        0,
      );

      const examCompletion = {
        score,
        questionAnswers,
        exam: exam || undefined,
      } as ExamCompletion;

      setExamCompletion(examCompletion);
      return examCompletion;
    },
    [exam],
  );

  return {
    isDone,
    setIsDone,
    titlePreview,
    exam: exam || null,
    examCompletion,
    submitExam,
  };
}
