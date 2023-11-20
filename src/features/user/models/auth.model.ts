import type { UserApprovalStatus, UserGender } from './user.model';

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthRegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  phoneNumber: string;
  gender: UserGender;
  middleName?: string;
  teacherId?: string;
  approvalStatus?: UserApprovalStatus;
};
