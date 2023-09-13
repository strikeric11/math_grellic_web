import dayjs from 'dayjs';

import { transformToStudentUserAccount } from '#/user/helpers/user-transform.helper';

import type { Lesson, LessonSchedule } from '../models/lesson.model';

export function transformToLesson({
  id,
  createdAt,
  updatedAt,
  status,
  orderNumber,
  title,
  slug,
  videoUrl,
  durationSeconds,
  description,
  schedules,
}: any): Lesson {
  const transformedSchedules = schedules
    ? schedules.map((schedule: any) => transformToLessonSchedule(schedule))
    : undefined;

  return {
    id,
    createdAt: dayjs(createdAt).toDate(),
    updatedAt: dayjs(updatedAt).toDate(),
    status,
    orderNumber,
    title,
    slug,
    videoUrl,
    durationSeconds,
    description,
    schedules: transformedSchedules,
  };
}

export function transformToLessonSchedule({
  id,
  createdAt,
  updatedAt,
  startDate,
  students,
}: any): Partial<LessonSchedule> {
  const transformedStudents = !students?.length
    ? null
    : students.map((student: any) => transformToStudentUserAccount(student));

  return {
    id,
    createdAt: dayjs(createdAt).toDate(),
    updatedAt: dayjs(updatedAt).toDate(),
    startDate: dayjs(startDate).toDate(),
    students: transformedStudents,
  };
}
export function transformToLessonFormData({
  status,
  orderNumber,
  title,
  videoUrl,
  durationSeconds,
  description,
  schedules,
}: any) {
  let startDate = undefined;
  let startTime = undefined;
  let studentIds = undefined;

  if (schedules?.length === 1) {
    const dayJsStartDate = dayjs(schedules[0].startDate);

    startDate = dayJsStartDate.toDate();
    startTime = dayJsStartDate.format('hh:mm A');
    studentIds = schedules[0].students?.map((student: any) => student.id) || [];
  }

  return {
    status,
    orderNumber,
    title,
    videoUrl,
    durationSeconds,
    description: description || undefined,
    startDate,
    startTime,
    studentIds,
  };
}

export function transformToLessonCreateDto({
  status,
  orderNumber,
  title,
  videoUrl,
  durationSeconds,
  description,
  startDate,
  startTime,
  studentIds,
}: any) {
  const date = dayjs(startDate).format('YYYY-MM-DD');
  const transformedStartDate = dayjs(`${date} ${startTime}`).toDate();
  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  return {
    status,
    orderNumber,
    title,
    videoUrl,
    durationSeconds,
    description,
    startDate: transformedStartDate,
    studentIds: transformedStudentsIds,
  };
}

export function transformToLessonUpdateDto({
  status,
  orderNumber,
  title,
  videoUrl,
  durationSeconds,
  description,
  startDate,
  startTime,
  studentIds,
}: any) {
  const date = dayjs(startDate).format('YYYY-MM-DD');
  const transformedStartDate = dayjs(`${date} ${startTime}`).toDate();
  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  return {
    status,
    orderNumber,
    title,
    videoUrl,
    durationSeconds,
    description,
    startDate: transformedStartDate,
    studentIds: transformedStudentsIds,
  };
}
