import type { ExActTextType, RecordStatus } from '#/core/models/core.model';
import type { ActivityCategoryLevel, Game } from './activity.model';

export type ActivityCategoryQuestionChoiceFormData = {
  id: number;
  orderNumber: number;
  text: string;
  textType: ExActTextType;
  isCorrect: boolean;
  imageData?: string;
};

export type ActivityCategoryQuestionFormData = {
  id: number;
  orderNumber: number;
  text: string;
  textType: ExActTextType;
  choices: ActivityCategoryQuestionChoiceFormData[];
  stageNumber?: number;
  hintText?: string;
  imageData?: string;
};

export type ActivityCategoryStageQuestionsFormData = {
  questions: ActivityCategoryQuestionFormData[];
};

export type ActivityCategoryFormData = {
  id: number;
  level: ActivityCategoryLevel;
  randomizeQuestions: boolean;
  visibleQuestionsCount: number;
  questions: ActivityCategoryQuestionFormData[];
  stageQuestions?: ActivityCategoryStageQuestionsFormData[];
  correctAnswerCount?: number;
  pointsPerQuestion?: number;
  totalStageCount?: number;
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
