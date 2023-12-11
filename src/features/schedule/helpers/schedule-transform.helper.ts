import dayjs from '#/config/dayjs.config';
import { transformToBaseModel } from '#/base/helpers/base.helper';
import { transformToExamSchedule } from '#/exam/helpers/exam-transform.helper';
import { transformToLessonSchedule } from '#/lesson/helpers/lesson-transform.helper';
import { transformToStudentUserAccount } from '#/user/helpers/user-transform.helper';

import type { StudentUserAccount } from '#/user/models/user.model';
import type {
  MeetingSchedule,
  TimelineSchedules,
} from '../models/schedule.model';
import type { MeetingScheduleUpsertFormData } from '../models/schedule-form-data.model';

export function transformToMeetingSchedule({
  id,
  createdAt,
  updatedAt,
  title,
  meetingUrl,
  description,
  startDate,
  endDate,
  students,
}: any): MeetingSchedule {
  const transformedStudents = !students?.length
    ? null
    : students.map((student: any) => transformToStudentUserAccount(student));

  return {
    title,
    meetingUrl,
    description,
    startDate: dayjs(startDate).toDate(),
    endDate: dayjs(endDate).toDate(),
    students: transformedStudents,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToTimelineSchedules({
  lessonSchedules,
  examSchedules,
  meetingSchedules,
}: any): TimelineSchedules {
  const transformedLessonSchedules = lessonSchedules.map((schedule: any) =>
    transformToLessonSchedule(schedule),
  );

  const transformedExamSchedules = examSchedules.map((schedule: any) =>
    transformToExamSchedule(schedule),
  );

  const transformedMeetingSchedules = meetingSchedules.map((schedule: any) =>
    transformToMeetingSchedule(schedule),
  );

  return {
    lessonSchedules: transformedLessonSchedules,
    examSchedules: transformedExamSchedules,
    meetingSchedules: transformedMeetingSchedules,
  };
}

export function transformToMeetingScheduleFormData({
  title,
  meetingUrl,
  description,
  startDate,
  endDate,
  students,
}: any): MeetingScheduleUpsertFormData {
  const dayJsStartDate = dayjs(startDate);
  const dayJsEndDate = dayjs(endDate);

  const formStartDate = dayJsStartDate.toDate();
  const formStartTime = dayJsStartDate.format('hh:mm A');
  const formEndDate = dayJsEndDate.toDate();
  const formEndTime = dayJsEndDate.format('hh:mm A');
  const studentIds =
    students?.map((student: StudentUserAccount) => student.id) || [];

  return {
    title,
    meetingUrl,
    description,
    startDate: formStartDate,
    startTime: formStartTime,
    endDate: formEndDate,
    endTime: formEndTime,
    studentIds,
  };
}

export function transformToMeetingScheduleUpsertDto({
  title,
  meetingUrl,
  description,
  startDate,
  startTime,
  endDate,
  endTime,
  studentIds,
}: any) {
  const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
  const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

  const transformedStartDate = dayjs(
    `${formattedStartDate} ${startTime}`,
  ).toDate();
  const transformedEndDate = dayjs(`${formattedEndDate} ${endTime}`).toDate();
  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  return {
    title,
    description,
    meetingUrl,
    startDate: transformedStartDate,
    endDate: transformedEndDate,
    studentIds: transformedStudentsIds,
  };
}
