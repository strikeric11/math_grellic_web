import type { AuditTrail } from '#/core/models/core.model';
import type { ExamSchedule } from '#/exam/models/exam.model';
import type { LessonSchedule } from '#/lesson/models/lesson.model';
import type { StudentUserAccount } from '#/user/models/user.model';

export enum ScheduleType {
  Lesson = 'lesson',
  Exam = 'exam',
  Meeting = 'meeting',
}

export type MeetingSchedule = Partial<AuditTrail> & {
  id: number;
  title: string;
  meetingUrl: string;
  startDate: Date;
  endDate: Date;
  students: StudentUserAccount[];
  description?: string;
};

export type TimelineSchedules = {
  lessonSchedules: LessonSchedule[];
  examSchedules: ExamSchedule[];
  meetingSchedules: MeetingSchedule[];
};

export type ScheduleCard = (LessonSchedule | ExamSchedule | MeetingSchedule) & {
  type: ScheduleType;
  isStart: boolean;
  isEnd: boolean;
};

export type StudentMeetingScheduleList = {
  upcomingMeetingSchedules: MeetingSchedule[];
  currentMeetingSchedules: MeetingSchedule[];
  previousMeetingSchedules: MeetingSchedule[];
};
