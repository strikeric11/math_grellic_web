import { AuditTrail } from '#/core/models/core.model';

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

export type User = AuditTrail & {
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

type UserAccount = AuditTrail & {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: Date; // TODO convert string to date
  phoneNumber: string;
  gender: UserGender;
};

export type TeacherUserAccount = UserAccount & {
  aboutMe?: string;
  educationalBackground?: string;
  teachingExperience?: string;
  teachingCertifications?: string;
  website?: string;
  socialMediaLinks: string[];
  emails: string[];
  students?: StudentUserAccount[];
};

export type StudentUserAccount = UserAccount & {
  teacherId: string;
  aboutMe?: string;
};

export type UserSlice = {
  user?: User | null;
  setUser: (user?: User) => void;
};
