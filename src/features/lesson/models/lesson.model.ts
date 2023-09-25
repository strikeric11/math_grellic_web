import type { AuditTrail, RecordStatus } from '#/core/models/core.model';
import type { StudentUserAccount } from '#/user/models/user.model';

export type Lesson = Partial<AuditTrail> & {
  id: number;
  orderNumber: number;
  status: RecordStatus;
  title: string;
  slug: string;
  videoUrl: string;
  durationSeconds?: number;
  description?: string;
  excerpt?: string;
  schedules?: Partial<LessonSchedule>[];
  completions?: Partial<LessonCompletion>[];
};

export type LessonSchedule = Partial<AuditTrail> & {
  id: number;
  startDate: Date;
  lesson: Lesson;
  students: StudentUserAccount[];
};

export type LessonCompletion = Partial<AuditTrail> & {
  id: number;
  lesson: Lesson;
  student: StudentUserAccount;
};

export type LessonUpsertFormData = {
  status: RecordStatus;
  orderNumber: number;
  title: string;
  videoUrl: string;
  slug?: string;
  duration?: string;
  description?: string;
  excerpt?: string;
  // Schedule
  startDate?: Date;
  startTime?: string;
  studentIds?: number[];
};

export type LessonScheduleUpsertFormData = {
  lessonId: number;
  startDate: Date;
  startTime: string;
  studentIds: number[];
};

export type LessonSlice = {
  lessonFormData?: LessonUpsertFormData | null;
  setLessonFormData: (lessonFormData?: LessonUpsertFormData) => void;
};
