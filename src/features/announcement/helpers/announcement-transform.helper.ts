import dayjs from '#/config/dayjs.config';

import { transformToBaseModel } from '#/base/helpers/base.helper';
import { transformToStudentUserAccount } from '#/user/helpers/user-transform.helper';

import type { StudentUserAccount } from '#/user/models/user.model';
import type {
  Announcement,
  StudentAnnouncements,
  TeacherAnnouncements,
} from '../models/announcement.model';
import type { AnnouncementUpsertFormData } from '../models/announcement-form-data.model';

export function transformToAnnouncement({
  id,
  createdAt,
  updatedAt,
  title,
  description,
  startDate,
  students,
}: any): Announcement {
  const transformedStudents = !students?.length
    ? null
    : students.map((student: any) => transformToStudentUserAccount(student));

  return {
    title,
    description,
    startDate: dayjs(startDate).toDate(),
    students: transformedStudents,
    ...transformToBaseModel(id, createdAt, updatedAt),
  };
}

export function transformToTeacherAnnouncements({
  currentAnnouncements,
  upcomingAnnouncements,
}: any): TeacherAnnouncements {
  const transformedCurrentAnnouncements = currentAnnouncements.map(
    (announcement: any) => transformToAnnouncement(announcement),
  );

  const transformedUpcomingAnnouncements = upcomingAnnouncements.map(
    (announcement: any) => transformToAnnouncement(announcement),
  );

  return {
    currentAnnouncements: transformedCurrentAnnouncements,
    upcomingAnnouncements: transformedUpcomingAnnouncements,
  };
}

export function transformToStudentAnnouncements({
  currentAnnouncements,
  upcomingAnnouncements,
}: any): StudentAnnouncements {
  const transformedCurrentAnnouncements = currentAnnouncements.map(
    (announcement: any) => transformToAnnouncement(announcement),
  );

  const transformedUpcomingAnnouncements = upcomingAnnouncements.map(
    ({ startDate }: any) => ({ startDate: dayjs(startDate).toDate() }),
  );

  return {
    currentAnnouncements: transformedCurrentAnnouncements,
    upcomingAnnouncements: transformedUpcomingAnnouncements,
  };
}

export function transformToAnnouncementFormData({
  title,
  description,
  startDate,
  students,
}: any): AnnouncementUpsertFormData {
  const dayJsStartDate = dayjs(startDate);

  const formStartDate = dayJsStartDate.toDate();
  const formStartTime = dayJsStartDate.format('hh:mm A');
  const studentIds =
    students?.map((student: StudentUserAccount) => student.id) || [];

  return {
    title,
    description,
    startDate: formStartDate,
    startTime: formStartTime,
    studentIds,
  };
}

export function transformToAnnouncementUpsertDto({
  title,
  description,
  startDate,
  startTime,
  studentIds,
}: any) {
  const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');

  const transformedStartDate = dayjs(
    `${formattedStartDate} ${startTime}`,
  ).toDate();
  const transformedStudentsIds = !studentIds?.length ? null : studentIds;

  return {
    title,
    description,
    startDate: transformedStartDate,
    studentIds: transformedStudentsIds,
  };
}
