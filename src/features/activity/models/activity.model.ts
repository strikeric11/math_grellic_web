import type { AuditTrail, RecordStatus } from '#/core/models/core.model';
import type { StudentUserAccount } from '#/user/models/user.model';
import type { ActivityUpsertFormData } from './activity-form-data.model';

export enum ActivityGame {
  AngryBirds = 'angry_birds',
  Basketball = 'basketball',
  CarRacing = 'car_racing',
  EscapeRoom = 'escape_room',
  SlidePuzzle = 'slide_puzzle',
}

export enum ActivityCategoryType {
  Point = 'point',
  Time = 'time',
}

export enum ActivityCategoryLevel {
  Easy = 1,
  Average,
  Difficult,
}

export const activityGameLabel = {
  [ActivityGame.AngryBirds]: 'Angry Birds',
  [ActivityGame.Basketball]: 'Basketball',
  [ActivityGame.CarRacing]: 'Car Racing',
  [ActivityGame.EscapeRoom]: 'Escape Room',
  [ActivityGame.SlidePuzzle]: 'Slide Puzzle',
};

export const categoryLevel = {
  [ActivityCategoryLevel.Easy]: {
    iconName: 'number-square-one',
    levelName: ActivityCategoryLevel[ActivityCategoryLevel.Easy],
  },
  [ActivityCategoryLevel.Average]: {
    iconName: 'number-square-two',
    levelName: ActivityCategoryLevel[ActivityCategoryLevel.Average],
  },
  [ActivityCategoryLevel.Difficult]: {
    iconName: 'number-square-three',
    levelName: ActivityCategoryLevel[ActivityCategoryLevel.Difficult],
  },
};

export type Game = { name: string; type: string };

export type Activity = Partial<AuditTrail> & {
  id: number;
  orderNumber: number;
  status: RecordStatus;
  title: string;
  slug: string;
  game: Game;
  categories: ActivityCategory[];
  description?: string;
  excerpt?: string;
};

export type ActivityCategory = Partial<AuditTrail> & {
  id: number;
  level: ActivityCategoryLevel;
  randomizeQuestions: boolean;
  visibleQuestionsCount: number;
  questions: ActivityCategoryQuestion[];
  typePoint?: ActivityCategoryTypePoint;
  typeTime?: ActivityCategoryTypeTime;
  completions?: ActivityCategoryCompletion[];
};

export type ActivityCategoryQuestion = Partial<AuditTrail> & {
  id: number;
  orderNumber: number;
  text: string;
  choices: ActivityCategoryQuestionChoice[];
};

export type ActivityCategoryQuestionChoice = Partial<AuditTrail> & {
  id: number;
  orderNumber: number;
  text: string;
  isExpression: boolean;
  isCorrect: boolean;
};

export type ActivityCategoryTypePoint = Partial<AuditTrail> & {
  id: number;
  pointsPerQuestion: number;
  durationSeconds: number;
};

export type ActivityCategoryTypeTime = Partial<AuditTrail> & {
  id: number;
  correctAnswerCount: number;
};

export type ActivityCategoryCompletion = Partial<AuditTrail> & {
  id: number;
  submittedAt: Date;
  score: number | null;
  timeCompletedSeconds: number | null;
  questionAnswers: ActivityCategoryCompletionQuestionAnswer[];
  activityCategory: ActivityCategory;
  student: StudentUserAccount;
};

export type ActivityCategoryCompletionQuestionAnswer = Partial<AuditTrail> & {
  id: number;
  question: ActivityCategoryQuestion;
  selectedQuestionChoice: ActivityCategoryQuestionChoice;
};

export type ActivitySlice = {
  activityFormData?: ActivityUpsertFormData | null;
  setActivityFormData: (activityFormData?: ActivityUpsertFormData) => void;
};

export type StudentActivityList = {
  featuredActivities: Activity[];
  otherActivities: Activity[];
};
