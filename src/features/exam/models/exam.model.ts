import type { AuditTrail, RecordStatus } from '#/core/models/core.model';
import type { Lesson } from '#/lesson/models/lesson.model';
import type { StudentUserAccount } from '#/user/models/user.model';

export type Exam = Partial<AuditTrail> & {
  id: number;
  orderNumber: number;
  status: RecordStatus;
  title: string;
  slug: string;
  randomizeQuestions: boolean;
  visibleQuestionsCount: number;
  pointsPerQuestion: number;
  questions: ExamQuestion[];
  description?: string;
  excerpt?: string;
  coveredLessons?: Partial<Lesson>[];
  schedules?: ExamSchedule[];
};

export type ExamQuestion = Partial<AuditTrail> & {
  id: number;
  orderNumber: number;
  text: string;
  choices: ExamQuestionChoice[];
};

export type ExamQuestionChoice = Partial<AuditTrail> & {
  id: number;
  text: string;
  isCorrect: boolean;
};

export type ExamSchedule = Partial<AuditTrail> & {
  id: number;
  startDate: Date;
  endDate: Date;
  exam: Exam;
  students: StudentUserAccount[];
};

export type ExamQuestionChoiceFormData = {
  id: number;
  text: string;
  isCorrect: boolean;
};

export type ExamQuestionFormData = {
  id: number;
  orderNumber: number;
  text: string;
  choices: ExamQuestionChoiceFormData[];
};

export type ExamUpsertFormData = {
  orderNumber: number;
  status: RecordStatus;
  title: string;
  randomizeQuestions: boolean;
  visibleQuestionsCount: number;
  pointsPerQuestion: number;
  questions: ExamQuestionFormData[];
  slug?: string;
  description?: string;
  excerpt?: string;
  coveredLessonIds?: number[];
  // Schedule
  startDate?: Date;
  startTime?: string;
  endDate?: Date;
  endTime?: string;
  studentIds?: number[];
};

export type ExamScheduleUpsertFormData = {
  examId: number;
  startDate: Date;
  endDate: Date;
  startTime: string;
  studentIds: number[];
};

export type ExamSlice = {
  examFormData?: ExamUpsertFormData | null;
  setExamFormData: (examFormData?: ExamUpsertFormData) => void;
};
