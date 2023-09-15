import { RecordStatus } from '#/core/models/core.model';

import type { AuditTrail } from '#/core/models/core.model';
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
  schedules?: Partial<LessonSchedule>[];
};

export type LessonSchedule = Partial<AuditTrail> & {
  id: number;
  startDate: Date;
  lesson: Lesson;
  students: StudentUserAccount[];
};

export type LessonUpsertFormData = {
  status: RecordStatus;
  orderNumber: number;
  title: string;
  videoUrl: string;
  slug?: string;
  duration?: number;
  description?: string;
  startDate?: Date;
  startTime?: string;
  studentIds?: number[];
};

export type LessonSlice = {
  lessonFormData?: LessonUpsertFormData | null;
  setLessonFormData: (lessonFormData?: LessonUpsertFormData) => void;
};
