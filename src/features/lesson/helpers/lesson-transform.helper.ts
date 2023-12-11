import dayjs from '#/config/dayjs.config';
import {
  convertDurationToSeconds,
  convertSecondsToDuration,
} from '#/utils/time.util';
import { transformToBaseModel } from '#/base/helpers/base.helper';
import { transformToStudentUserAccount } from '#/user/helpers/user-transform.helper';

import type { StudentUserAccount } from '#/user/models/user.model';
import type {
  Lesson,
  LessonCompletion,
  LessonSchedule,
} from '../models/lesson.model';
import type {
  LessonScheduleUpsertFormData,
  LessonUpsertFormData,
} from '../models/lesson-form-data.model';

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
  excerpt,
  schedules,
  completions,
}: any): Lesson {
  const transformedSchedules = schedules
    ? schedules.map((schedule: any) => transformToLessonSchedule(schedule))
    : undefined;

  const transformedCompletions = completions
    ? completions.map((completion: any) =>
        transformToLessonCompletion(completion),
      )
    : undefined;

  return {
    status,
    orderNumber,
    title,
    slug,
    videoUrl,
    durationSeconds,
    description,
    excerpt,
    schedules: transformedSchedules,
    completions: transformedCompletions,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToLessonSchedule({
  id,
  createdAt,
  updatedAt,
  startDate,
  students,
  lesson,
}: any): Partial<LessonSchedule> {
  const transformedStudents = !students?.length
    ? null
    : students.map((student: any) => transformToStudentUserAccount(student));

  const transformedLesson = lesson ? transformToLesson(lesson) : undefined;

  return {
    startDate: dayjs(startDate).toDate(),
    students: transformedStudents,
    lesson: transformedLesson,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToLessonCompletion({
  id,
  createdAt,
  updatedAt,
  lesson,
  student,
}: any): Partial<LessonCompletion> {
  const transformedStudent = student
    ? ({ id: student.id } as StudentUserAccount)
    : undefined;

  return {
    lesson,
    student: transformedStudent,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToLessonFormData({
  status,
  orderNumber,
  title,
  videoUrl,
  durationSeconds,
  description,
  excerpt,
  schedules,
}: any): LessonUpsertFormData {
  const duration = convertSecondsToDuration(durationSeconds);
  // Convert schedule
  let startDate = undefined;
  let startTime = undefined;
  let studentIds = undefined;

  if (schedules?.length === 1) {
    const dayJsStartDate = dayjs(schedules[0].startDate);

    startDate = dayJsStartDate.toDate();
    startTime = dayJsStartDate.format('hh:mm A');
    studentIds =
      schedules[0].students?.map((student: StudentUserAccount) => student.id) ||
      [];
  }

  return {
    status,
    orderNumber,
    title,
    videoUrl,
    duration,
    description: description || undefined,
    excerpt: excerpt || undefined,
    startDate,
    startTime,
    studentIds,
  };
}

export function transformToLessonScheduleFormData({
  lesson,
  startDate,
  students,
}: any): LessonScheduleUpsertFormData {
  const transformedStudentIds = !students?.length
    ? null
    : students.map((student: StudentUserAccount) => student.id);

  return {
    lessonId: lesson?.id || 0,
    studentIds: transformedStudentIds,
    startDate: dayjs(startDate).toDate(),
    startTime: dayjs(startDate).format('hh:mm A'),
  };
}

export function transformToLessonUpsertDto({
  status,
  orderNumber,
  title,
  videoUrl,
  duration,
  description,
  excerpt,
  startDate,
  startTime,
  studentIds,
}: any) {
  const durationSeconds = duration
    ? convertDurationToSeconds(duration)
    : undefined;

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
    excerpt,
    startDate: transformedStartDate,
    studentIds: transformedStudentsIds,
  };
}

export function transformToLessonScheduleCreateDto({
  lessonId,
  startDate,
  startTime,
  studentIds,
}: any) {
  const date = dayjs(startDate).format('YYYY-MM-DD');
  const transformedStartDate = dayjs(`${date} ${startTime}`).toDate();
  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  return {
    lessonId,
    startDate: transformedStartDate,
    studentIds: transformedStudentsIds,
  };
}

export function transformToLessonScheduleUpdateDto({
  startDate,
  startTime,
  studentIds,
}: any) {
  const date = dayjs(startDate).format('YYYY-MM-DD');
  const transformedStartDate = dayjs(`${date} ${startTime}`).toDate();
  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  return {
    startDate: transformedStartDate,
    studentIds: transformedStudentsIds,
  };
}
