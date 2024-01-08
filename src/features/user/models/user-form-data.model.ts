export type TeacherUserUpdateFormData = {
  phoneNumber: string;
  aboutMe: string;
  educationalBackground: string;
  teachingExperience: string;
  teachingCertifications: string;
  website: string;
  socialMediaLinks: string[];
  messengerLink: string;
  emails: string[];
  profileImageUrl?: string;
};

export type StudentUserUpdateFormData = {
  phoneNumber: string;
  aboutMe: string;
  messengerLink: string;
  profileImageUrl?: string;
};
