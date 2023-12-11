import type { StudentUserAccount } from '#/user/models/user.model';

export enum StudentPerformanceType {
  Lesson = 'lesson',
  Exam = 'exam',
  Activity = 'activity',
}

export type StudentPerformance = StudentUserAccount & {
  currentExamCount: number;
  examsCompletedCount: number;
  examsPassedCount: number;
  examsFailedCount: number;
  examsExpiredCount: number;
  overallExamCompletionPercent: number;
  overallExamRank: number;
  overallExamScore: number | null;
  totalActivityCount: number;
  activitiesCompletedCount: number;
  overallActivityCompletionPercent: number;
  overallActivityRank: number;
  overallActivityScore: number | null;
  totalLessonCount: number;
  currentLessonCount: number;
  lessonsCompletedCount: number;
  overallLessonCompletionPercent: number;
};

export type TeacherClassPerformance = {
  overallLessonCompletionPercent: number;
  overallExamCompletionPercent: number;
  overallActivityCompletionPercent: number;
};
