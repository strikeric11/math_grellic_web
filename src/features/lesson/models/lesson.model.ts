import type { Duration } from 'dayjs/plugin/duration';

import type { AuditTrail, RecordStatus } from '#/core/models/core.model';
import type { StudentUserAccount } from '#/user/models/user.model';
import type { LessonUpsertFormData } from './lesson-form-data.model';

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

export type LessonWithDuration = {
  lesson: Lesson | null;
  duration: Duration | null;
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

export type LessonSlice = {
  lessonFormData?: LessonUpsertFormData | null;
  setLessonFormData: (lessonFormData?: LessonUpsertFormData) => void;
};

export type StudentLessonList = {
  latestLesson: Lesson | null;
  upcomingLesson: Lesson | null;
  previousLessons: Lesson[];
};
