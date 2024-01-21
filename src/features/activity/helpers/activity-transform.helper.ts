import dayjs from '#/config/dayjs.config';
import {
  convertDurationToSeconds,
  convertSecondsToDuration,
} from '#/utils/time.util';
import { ExActTextType } from '#/core/models/core.model';
import {
  getQuestionImageUrl,
  transformToBaseModel,
} from '#/base/helpers/base.helper';
import { ActivityCategoryType } from '../models/activity.model';

import type { StudentUserAccount } from '#/user/models/user.model';
import type {
  Activity,
  ActivityCategory,
  ActivityCategoryCompletion,
  ActivityCategoryCompletionQuestionAnswer,
  ActivityCategoryQuestion,
  ActivityCategoryQuestionChoice,
  ActivityCategoryTypePoint,
  ActivityCategoryTypeStage,
  ActivityCategoryTypeTime,
} from '../models/activity.model';
import type {
  ActivityCategoryFormData,
  ActivityCategoryQuestionChoiceFormData,
  ActivityCategoryQuestionFormData,
  ActivityUpsertFormData,
} from '../models/activity-form-data.model';

export function transformToActivity({
  id,
  createdAt,
  updatedAt,
  status,
  orderNumber,
  title,
  slug,
  description,
  excerpt,
  game,
  categories,
  score,
  rank,
}: any): Activity {
  const transformedCategories =
    categories?.map((category: any) => transformToActivityCategory(category)) ||
    [];

  return {
    status,
    orderNumber,
    title,
    slug,
    description,
    excerpt,
    game,
    categories: transformedCategories,
    score,
    rank,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToActivityCategory({
  id,
  createdAt,
  updatedAt,
  level,
  randomizeQuestions,
  visibleQuestionsCount,
  questions,
  typePoint,
  typeTime,
  typeStage,
  completions,
}: any): ActivityCategory {
  const transformedQuestions =
    questions?.map((question: any) =>
      transformToActivityCategoryQuestion(question),
    ) || [];

  const transformedTypePoint = typePoint
    ? transformToActivityCategoryTypePoint(typePoint)
    : undefined;

  const transformedTypeTime = typeTime
    ? transformToActivityCategoryTypeTime(typeTime)
    : undefined;

  const transformedTypeStage = typeStage
    ? transformToActivityCategoryTypeStage(typeStage)
    : undefined;

  const transformedCompletions = completions
    ? completions.map((completion: any) =>
        transformToActivityCategoryCompletion(completion),
      )
    : undefined;

  return {
    level,
    randomizeQuestions,
    visibleQuestionsCount,
    questions: transformedQuestions,
    typePoint: transformedTypePoint,
    typeTime: transformedTypeTime,
    typeStage: transformedTypeStage,
    completions: transformedCompletions,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToActivityCategoryQuestion({
  id,
  createdAt,
  updatedAt,
  orderNumber,
  text,
  textType,
  choices,
  stageNumber,
  hintText,
}: any): ActivityCategoryQuestion {
  const transformedChoices = choices
    ? choices.map((choice: any) =>
        transformToActivityCategoryQuestionChoice(choice),
      )
    : [];

  return {
    orderNumber,
    text,
    textType,
    choices: transformedChoices,
    stageNumber,
    hintText,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToActivityCategoryQuestionChoice({
  id,
  createdAt,
  updatedAt,
  orderNumber,
  text,
  textType,
  isCorrect,
}: any): ActivityCategoryQuestionChoice {
  return {
    orderNumber,
    text,
    textType,
    isCorrect,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToActivityCategoryTypePoint({
  id,
  createdAt,
  updatedAt,
  pointsPerQuestion,
  durationSeconds,
}: any): ActivityCategoryTypePoint {
  return {
    pointsPerQuestion,
    durationSeconds,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToActivityCategoryTypeTime({
  id,
  createdAt,
  updatedAt,
  correctAnswerCount,
}: any): ActivityCategoryTypeTime {
  return {
    correctAnswerCount,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToActivityCategoryTypeStage({
  id,
  createdAt,
  updatedAt,
  totalStageCount,
}: any): ActivityCategoryTypeStage {
  return {
    totalStageCount,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToActivityCategoryCompletion({
  id,
  createdAt,
  updatedAt,
  submittedAt,
  score,
  timeCompletedSeconds,
  questionAnswers,
  activityCategory,
  student,
}: any): Partial<ActivityCategoryCompletion> {
  const transformedStudent = student
    ? ({ id: student.id } as StudentUserAccount)
    : undefined;

  const transformedQuestionAnswers =
    questionAnswers?.map((answer: any) =>
      transformToActivityCategoryCompletionQuestionAnswer(answer),
    ) || [];

  return {
    submittedAt: dayjs(submittedAt).toDate(),
    score,
    timeCompletedSeconds,
    questionAnswers: transformedQuestionAnswers,
    activityCategory,
    student: transformedStudent,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToActivityCategoryCompletionQuestionAnswer({
  id,
  createdAt,
  updatedAt,
  question,
  selectedQuestionChoice,
}: any): Partial<ActivityCategoryCompletionQuestionAnswer> {
  return {
    question: { id: question.id } as ActivityCategoryQuestion,
    selectedQuestionChoice: {
      id: selectedQuestionChoice.id,
    } as ActivityCategoryQuestionChoice,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToActivityFormData({
  status,
  orderNumber,
  title,
  slug,
  game,
  description,
  excerpt,
  categories,
}: any): ActivityUpsertFormData {
  const transformedCategories =
    categories?.map((category: any) => transformToCategoryFormData(category)) ||
    [];

  return {
    status,
    orderNumber,
    title,
    slug,
    game,
    description: description || undefined,
    excerpt: excerpt || undefined,
    categories: transformedCategories,
  };
}

export function transformToCategoryFormData({
  id,
  level,
  randomizeQuestions,
  visibleQuestionsCount,
  questions,
  typePoint,
  typeTime,
  typeStage,
}: any): ActivityCategoryFormData {
  const { pointsPerQuestion, durationSeconds } = typePoint || {};
  const { correctAnswerCount } = typeTime || {};
  const { totalStageCount } = typeStage || {};

  const duration = durationSeconds
    ? convertSecondsToDuration(durationSeconds)
    : undefined;

  const transformedQuestions =
    questions?.map((question: any) =>
      transformToCategoryQuestionFormData(question),
    ) || [];

  const stageQuestions = totalStageCount
    ? transformToCategoryStageQuestionsFormData(totalStageCount, questions)
    : undefined;

  return {
    id,
    level,
    randomizeQuestions,
    visibleQuestionsCount,
    questions: transformedQuestions,
    pointsPerQuestion,
    duration,
    correctAnswerCount,
    totalStageCount,
    stageQuestions,
  };
}

export function transformToCategoryStageQuestionsFormData(
  totalStageCount: number,
  sourceQuestions: ActivityCategoryQuestion[],
) {
  return [...Array(totalStageCount)].map((_, index) => {
    const questions = sourceQuestions
      .filter((question) => question.stageNumber === index + 1)
      .sort((qA, qB) => qA.orderNumber - qB.orderNumber);

    const transformedQuestions =
      questions?.map((question: any) =>
        transformToCategoryQuestionFormData(question),
      ) || [];

    return { questions: transformedQuestions };
  });
}

export function transformToCategoryQuestionFormData({
  id,
  orderNumber,
  text,
  textType,
  choices,
  stageNumber,
  hintText,
}: any): ActivityCategoryQuestionFormData {
  const transformedChoices =
    choices?.map((choice: any) =>
      transformToCategoryQuestionChoiceFormData(choice),
    ) || [];

  const imageData =
    textType === ExActTextType.Image ? getQuestionImageUrl(text) : undefined;

  return {
    id,
    orderNumber,
    text,
    textType,
    choices: transformedChoices,
    stageNumber: stageNumber || undefined,
    hintText: hintText || undefined,
    imageData,
  };
}

export function transformToCategoryQuestionChoiceFormData({
  id,
  orderNumber,
  text,
  textType,
  isCorrect,
}: any): ActivityCategoryQuestionChoiceFormData {
  const imageData =
    textType === ExActTextType.Image ? getQuestionImageUrl(text) : undefined;

  return {
    id,
    orderNumber,
    text,
    textType,
    isCorrect,
    imageData,
  };
}

export function transformToActivityUpsertDto({
  status,
  orderNumber,
  title,
  game,
  description,
  excerpt,
  categories,
}: any) {
  const categoriesDto =
    categories?.map((category: any) =>
      transformToCategoryUpsertDto(category, game.type),
    ) || [];

  return {
    status,
    orderNumber,
    title,
    game: game.name,
    description,
    excerpt,
    categories: categoriesDto,
  };
}

export function transformToCategoryUpsertDto(
  {
    id,
    level,
    randomizeQuestions,
    visibleQuestionsCount,
    correctAnswerCount,
    pointsPerQuestion,
    duration,
    totalStageCount,
    questions,
    stageQuestions,
  }: any,
  gameType: string,
) {
  const durationSeconds = duration
    ? convertDurationToSeconds(duration)
    : undefined;

  const targetQuestions =
    gameType === ActivityCategoryType.Stage
      ? stageQuestions.reduce(
          (total: any[], stageQuestion: any) => [
            ...total,
            ...(stageQuestion?.questions || []),
          ],
          [],
        )
      : questions;

  const questionsDto =
    targetQuestions?.map((question: any) =>
      transformToCategoryQuestionUpsertDto(question),
    ) || [];

  return {
    id,
    level,
    randomizeQuestions,
    visibleQuestionsCount,
    correctAnswerCount,
    pointsPerQuestion,
    durationSeconds,
    totalStageCount,
    questions: questionsDto,
  };
}

export function transformToCategoryQuestionUpsertDto({
  id,
  orderNumber,
  text,
  textType,
  choices,
  stageNumber,
  hintText,
}: any) {
  const choicesDto =
    choices?.map((choice: any) =>
      transformToCategoryQuestionChoiceUpsertDto(choice),
    ) || [];

  return {
    id,
    orderNumber,
    text,
    textType,
    choices: choicesDto,
    stageNumber,
    hintText,
  };
}

export function transformToCategoryQuestionChoiceUpsertDto({
  id,
  orderNumber,
  text,
  textType,
  isCorrect,
}: any) {
  return {
    id,
    orderNumber,
    text,
    textType,
    isCorrect,
  };
}
