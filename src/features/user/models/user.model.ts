import type { AuditTrail } from '#/core/models/core.model';
import type { ExamCompletion, ExamSchedule } from '#/exam/models/exam.model';
import type {
  LessonCompletion,
  LessonSchedule,
} from '#/lesson/models/lesson.model';
import type { ActivityCategoryCompletion } from '#/activity/models/activity.model';

export enum UserApprovalStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum UserRole {
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student',
}

export enum UserGender {
  Male = 'male',
  Female = 'female',
}

export type User = Partial<AuditTrail> & {
  id: number;
  email: string;
  supabaseUserId: string;
  publicId: string;
  role: UserRole;
  approvalStatus: UserApprovalStatus;
  approvalDate: Date | null;
  profileImageUrl?: string;
  userAccount?: TeacherUserAccount | StudentUserAccount; // TODO AdminUserAccount
};

type UserAccount = Partial<AuditTrail> & {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  phoneNumber: string;
  gender: UserGender;
  middleName?: string;
  email?: string;
  publicId?: string;
  approvalStatus?: UserApprovalStatus;
};

export type TeacherUserAccount = UserAccount & {
  aboutMe?: string;
  educationalBackground?: string;
  teachingExperience?: string;
  teachingCertifications?: string;
  website?: string;
  socialMediaLinks: string[];
  messengerLink?: string;
  emails: string[];
  students?: StudentUserAccount[];
};

export type StudentUserAccount = UserAccount & {
  teacherId: string;
  aboutMe?: string;
  messengerLink?: string;
  lessonSchedules?: LessonSchedule[];
  examSchedules?: ExamSchedule[];
  lessonCompletions?: LessonCompletion[];
  examCompletions?: ExamCompletion[];
  activityCategoryCompletions?: ActivityCategoryCompletion[];
};

export type UserSlice = {
  user?: User | null;
  setUser: (user?: User) => void;
};
