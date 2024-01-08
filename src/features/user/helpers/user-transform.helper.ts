import dayjs from '#/config/dayjs.config';
import {
  transformToLessonCompletion,
  transformToLessonSchedule,
} from '#/lesson/helpers/lesson-transform.helper';
import {
  transformToExamCompletion,
  transformToExamSchedule,
} from '#/exam/helpers/exam-transform.helper';
import { transformToActivityCategoryCompletion } from '#/activity/helpers/activity-transform.helper';
import { UserRole } from '../models/user.model';

import type { AuthRegisterFormData } from '../models/auth.model';
import type {
  StudentUserAccount,
  TeacherUserAccount,
  User,
} from '../models/user.model';
import type {
  StudentUserUpdateFormData,
  TeacherUserUpdateFormData,
} from '../models/user-form-data.model';

export function transformToUser({
  id,
  createdAt,
  updatedAt,
  supabaseUserId,
  publicId,
  role,
  email,
  profileImageUrl,
  approvalStatus,
  approvalDate,
  userAccount: userAccountData,
}: any): User {
  // TODO admin
  const userAccount =
    role === UserRole.Teacher
      ? transformToTeacherUserAccount(userAccountData)
      : transformToStudentUserAccount(userAccountData);

  return {
    id,
    createdAt: dayjs(createdAt).toDate(),
    updatedAt: dayjs(updatedAt).toDate(),
    supabaseUserId,
    publicId,
    role,
    email,
    profileImageUrl,
    approvalStatus,
    approvalDate: approvalDate ? dayjs(approvalDate).toDate() : null,
    userAccount,
  };
}

export function transformToTeacherUserAccount({
  id,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  educationalBackground,
  teachingExperience,
  teachingCertifications,
  website,
  socialMediaLinks,
  messengerLink,
  emails,
  user,
}: any): TeacherUserAccount {
  const { email, publicId, approvalStatus } = user || {};

  return {
    id,
    email,
    publicId,
    approvalStatus,
    firstName,
    lastName,
    middleName,
    birthDate: dayjs(birthDate).toDate(),
    phoneNumber,
    gender,
    aboutMe,
    educationalBackground,
    teachingExperience,
    teachingCertifications,
    website,
    socialMediaLinks,
    messengerLink,
    emails,
    //  students,
  } as TeacherUserAccount;
}

export function transformToStudentUserAccount({
  id,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  messengerLink,
  teacherId,
  user,
  lessonSchedules,
  examSchedules,
  lessonCompletions,
  examCompletions,
  activityCategoryCompletions,
}: any): StudentUserAccount {
  const { email, publicId, approvalStatus } = user || {};

  const transformedLessonSchedules =
    lessonSchedules && lessonSchedules.length
      ? lessonSchedules.map((schedule: any) =>
          transformToLessonSchedule(schedule),
        )
      : undefined;

  const transformedExamSchedules =
    examSchedules && examSchedules.length
      ? examSchedules.map((schedule: any) => transformToExamSchedule(schedule))
      : undefined;

  const transformedLessonCompletions =
    lessonCompletions && lessonCompletions.length
      ? lessonCompletions.map((completion: any) =>
          transformToLessonCompletion(completion),
        )
      : undefined;

  const transformedExamCompletions =
    examCompletions && examCompletions.length
      ? examCompletions.map((completion: any) =>
          transformToExamCompletion(completion),
        )
      : undefined;

  const transformedActivityCategoryCompletions =
    activityCategoryCompletions && activityCategoryCompletions.length
      ? activityCategoryCompletions.map((completion: any) =>
          transformToActivityCategoryCompletion(completion),
        )
      : undefined;

  return {
    id,
    email,
    publicId,
    approvalStatus,
    firstName,
    lastName,
    middleName,
    birthDate: dayjs(birthDate).toDate(),
    phoneNumber,
    gender,
    aboutMe,
    messengerLink,
    teacherId,
    lessonSchedules: transformedLessonSchedules,
    examSchedules: transformedExamSchedules,
    lessonCompletions: transformedLessonCompletions,
    examCompletions: transformedExamCompletions,
    activityCategoryCompletions: transformedActivityCategoryCompletions,
  } as StudentUserAccount;
}

export function transformToTeacherUserCreateDto({
  email,
  password,
  approvalStatus,
  profileImageUrl,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  educationalBackground,
  teachingExperience,
  teachingCertifications,
  website,
  socialMediaLinks,
  emails,
}: any) {
  return {
    email,
    password,
    approvalStatus,
    profileImageUrl,
    firstName,
    lastName,
    middleName,
    birthDate,
    phoneNumber: phoneNumber.replace(/\D/g, ''),
    gender,
    aboutMe,
    educationalBackground,
    teachingExperience,
    teachingCertifications,
    website,
    socialMediaLinks,
    emails,
  };
}

export function transformToTeacherUserUpdateDto({
  approvalStatus,
  profileImageUrl,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  educationalBackground,
  teachingExperience,
  teachingCertifications,
  website,
  socialMediaLinks,
  messengerLink,
  emails,
}: any) {
  return {
    approvalStatus,
    profileImageUrl,
    firstName,
    lastName,
    middleName,
    birthDate,
    phoneNumber: phoneNumber.replace(/\D/g, ''),
    gender,
    aboutMe,
    educationalBackground,
    teachingExperience,
    teachingCertifications,
    website,
    socialMediaLinks,
    messengerLink,
    emails,
  };
}

export function transformToStudentUserCreateDto({
  email,
  password,
  approvalStatus,
  profileImageUrl,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  teacherId,
}: any) {
  return {
    email,
    password,
    approvalStatus,
    profileImageUrl,
    firstName,
    lastName,
    middleName,
    birthDate,
    phoneNumber: phoneNumber.replace(/\D/g, ''),
    gender,
    aboutMe,
    teacherId: teacherId ? teacherId.toUpperCase() : undefined,
  };
}

export function transformToStudentUserUpdateDto({
  approvalStatus,
  profileImageUrl,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  messengerLink,
  teacherId,
}: any) {
  return {
    approvalStatus,
    profileImageUrl,
    firstName,
    lastName,
    middleName,
    birthDate,
    phoneNumber: phoneNumber.replace(/\D/g, ''),
    gender,
    aboutMe,
    messengerLink,
    teacherId: teacherId ? teacherId.toUpperCase() : undefined,
  };
}

export function transformToAuthRegisterFormData({
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  teacherId,
  email,
  approvalStatus,
}: any): AuthRegisterFormData {
  return {
    email,
    firstName,
    lastName,
    birthDate,
    phoneNumber,
    gender,
    middleName,
    teacherId,
    approvalStatus,
    password: 'xxxxxxxxxxxx',
    confirmPassword: 'xxxxxxxxxxxx',
  };
}

export function transformToTeacherUserAccountFormData({
  profileImageUrl,
  userAccount,
}: any): TeacherUserUpdateFormData {
  const {
    phoneNumber,
    aboutMe,
    educationalBackground,
    teachingExperience,
    teachingCertifications,
    website,
    socialMediaLinks,
    messengerLink,
    emails,
  } = userAccount || {};

  return {
    phoneNumber: phoneNumber?.length
      ? phoneNumber?.slice(1, phoneNumber.length)
      : undefined,
    aboutMe: aboutMe || undefined,
    educationalBackground: educationalBackground || undefined,
    teachingExperience: teachingExperience || undefined,
    teachingCertifications: teachingCertifications || undefined,
    website: website || undefined,
    socialMediaLinks: socialMediaLinks || undefined,
    messengerLink: messengerLink || undefined,
    emails: emails || undefined,
    profileImageUrl: profileImageUrl || undefined,
  };
}

export function transformToStudentUserAccountFormData({
  profileImageUrl,
  userAccount,
}: any): StudentUserUpdateFormData {
  const { phoneNumber, aboutMe, messengerLink } = userAccount || {};

  return {
    phoneNumber: phoneNumber?.length
      ? phoneNumber?.slice(1, phoneNumber.length)
      : undefined,
    aboutMe: aboutMe || undefined,
    messengerLink: messengerLink || undefined,
    profileImageUrl: profileImageUrl || undefined,
  };
}
