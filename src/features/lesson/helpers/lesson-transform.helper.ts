import dayjs from 'dayjs';
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
  startDate, // TODO students
}: any): Partial<LessonSchedule> {
  return {
    id,
    createdAt: dayjs(createdAt).toDate(),
    updatedAt: dayjs(updatedAt).toDate(),
    startDate: dayjs(startDate).toDate(),
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
