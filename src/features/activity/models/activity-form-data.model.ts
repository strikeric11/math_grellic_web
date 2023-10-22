import type { RecordStatus } from '#/core/models/core.model';
import type { ActivityCategoryLevel, Game } from './activity.model';

export type ActivityCategoryQuestionChoiceFormData = {
  id: number;
  orderNumber: number;
  text: string;
  isExpression: boolean;
  isCorrect: boolean;
};

export type ActivityCategoryQuestionFormData = {
  id: number;
  orderNumber: number;
  text: string;
  choices: ActivityCategoryQuestionChoiceFormData[];
};

export type ActivityCategoryFormData = {
  id: number;
  level: ActivityCategoryLevel;
  randomizeQuestions: boolean;
  visibleQuestionsCount: number;
  questions: ActivityCategoryQuestionFormData[];
  correctAnswerCount?: number;
  pointsPerQuestion?: number;
  duration?: string;
};

export type ActivityUpsertFormData = {
  orderNumber: number | null;
  status: RecordStatus;
  title: string;
  game: Game;
  categories: Partial<ActivityCategoryFormData>[];
  slug?: string;
  description?: string;
  excerpt?: string;
};

export type ActivityAnswerFormData = {
  questionId: number;
  selectedQuestionChoiceId: number;
};

export type StudentActivityFormData = {
  id: number;
  categoryId: number;
  answers: ActivityAnswerFormData[];
  timeCompletedSeconds?: number;
};
