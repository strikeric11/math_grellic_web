import type { AuditTrail } from '#/core/models/core.model';
import type { StudentUserAccount } from '#/user/models/user.model';

export type Announcement = Partial<AuditTrail> & {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  students: StudentUserAccount[];
};

export type TeacherAnnouncements = {
  currentAnnouncements: Announcement[];
  upcomingAnnouncements: Announcement[];
};

export type StudentAnnouncements = {
  currentAnnouncements: Announcement[];
  upcomingAnnouncements: {
    startDate: Date;
  }[];
};
