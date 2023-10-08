import { useCallback, useMemo, useState } from 'react';

import { useBoundStore } from '#/core/hooks/use-store.hook';

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

export function useExamPreview(): Result {
  const [isDone, setIsDone] = useState(false);
  const [examCompletion, setExamCompletion] = useState<ExamCompletion | null>(
    null,
  );

  const examFormData = useBoundStore((state) => state.examFormData);

  const exam = useMemo(() => {
    if (!examFormData) {
      return examFormData || null;
    }

    return { ...examFormData, id: 1 } as Exam;
  }, [examFormData]);

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

  return { isDone, setIsDone, titlePreview, exam, examCompletion, submitExam };
}
