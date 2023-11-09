import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import type { GroupLink, SceneRouteHandle } from '#/base/models/base.model';

const scheduleBaseRoute = `/${teacherBaseRoute}/${teacherRoutes.schedule.to}`;

const calendarLink = {
  to: scheduleBaseRoute,
  label: 'Calendar',
  icons: [{ name: 'calendar' }] as GroupLink['icons'],
};

const meetingListLink = {
  to: `${scheduleBaseRoute}/${teacherRoutes.schedule.meeting.to}`,
  label: 'Meeting List',
  icons: [{ name: 'presentation' }] as GroupLink['icons'],
};

const createScheduleLink = {
  to: `${scheduleBaseRoute}/${teacherRoutes.schedule.meeting.to}/${teacherRoutes.schedule.meeting.createTo}`,
  label: 'Schedule a Meeting',
  icons: [
    { name: 'plus', size: 16 },
    { name: 'calendar' },
  ] as GroupLink['icons'],
};

export const teacherScheduleRouteHandle: { [key: string]: SceneRouteHandle } = {
  calendar: {
    title: 'Calendar',
    links: [createScheduleLink, meetingListLink],
  },
  list: {
    title: 'Meeting Schedules',
    links: [createScheduleLink, calendarLink],
  },
  single: {
    title: 'Meeting Schedule',
    links: [createScheduleLink, meetingListLink],
  },
  create: {
    title: 'Schedule a Meeting',
    links: [calendarLink, meetingListLink],
  },
  edit: {
    title: 'Edit Meeting',
    links: [createScheduleLink, meetingListLink],
  },
};
