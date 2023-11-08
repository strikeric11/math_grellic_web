export type MeetingScheduleUpsertFormData = {
  title: string;
  meetingUrl: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  studentIds: number[];
  description?: string;
};
