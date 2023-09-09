import { AuditTrail, RecordStatus } from '#/core/models/core.model';

export type Lesson = Partial<AuditTrail> & {
  id: number;
  orderNumber: number;
  status: RecordStatus;
  title: string;
  slug: string;
  videoUrl: string;
  durationSeconds?: number;
  description?: string;
  schedules?: Partial<LessonSchedule>[];
};

export type LessonSchedule = Partial<AuditTrail> & {
  id: number;
  startDate: Date;
  lesson: Lesson;
};

export type LessonUpsertFormData = {
  status: RecordStatus;
  orderNumber: number;
  title: string;
  videoUrl: string;
  durationSeconds?: number;
  description?: string;
  startDate?: Date;
  startTime?: string;
};

export type LessonSlice = {
  lessonFormData?: LessonUpsertFormData | null;
  setLessonFormData: (lessonFormData?: LessonUpsertFormData) => void;
};
