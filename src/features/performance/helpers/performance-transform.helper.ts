import { transformToStudentUserAccount } from '#/user/helpers/user-transform.helper';

import type { StudentPerformance } from '../models/performance.model';

export function transformToStudentPerformance({
  currentExamCount,
  examsCompletedCount,
  examsPassedCount,
  examsFailedCount,
  examsExpiredCount,
  overallExamCompletionPercent,
  overallExamRank,
  overallExamScore,
  totalActivityCount,
  activitiesCompletedCount,
  overallActivityCompletionPercent,
  overallActivityRank,
  overallActivityScore,
  totalLessonCount,
  currentLessonCount,
  lessonsCompletedCount,
  overallLessonCompletionPercent,
  ...moreProps
}: any): StudentPerformance {
  const student = transformToStudentUserAccount(moreProps);

  return {
    ...student,
    currentExamCount,
    examsCompletedCount,
    examsPassedCount,
    examsFailedCount,
    examsExpiredCount,
    overallExamCompletionPercent,
    overallExamRank,
    overallExamScore,
    totalActivityCount,
    activitiesCompletedCount,
    overallActivityCompletionPercent,
    overallActivityRank,
    overallActivityScore,
    totalLessonCount,
    currentLessonCount,
    lessonsCompletedCount,
    overallLessonCompletionPercent,
  };
}
