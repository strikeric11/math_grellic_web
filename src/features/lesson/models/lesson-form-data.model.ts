import type { RecordStatus } from '#/core/models/core.model';

export type LessonUpsertFormData = {
  status: RecordStatus;
  orderNumber: number | null;
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
