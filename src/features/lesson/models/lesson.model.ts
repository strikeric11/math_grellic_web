import { AuditTrail, RecordStatus } from '#/core/models/core.model';

export type Lesson = AuditTrail & {
  id: number;
  orderNumber: number;
  status: RecordStatus;
  title: string;
  videoUrl: string;
  durationSeconds?: number;
  description?: string;
};

export type LessonUpsertFormData = {
  orderNumber: number;
  title: string;
  videoUrl: string;
  status: RecordStatus;
  durationSeconds?: number;
  description?: string;
  startDate?: Date;
  startTime?: string;
};

export type LessonSlice = {
  lessonFormData?: LessonUpsertFormData | null;
  setLessonFormData: (lessonFormData?: LessonUpsertFormData) => void;
};
