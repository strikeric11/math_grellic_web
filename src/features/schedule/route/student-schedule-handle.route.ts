import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import type { GroupLink, SceneRouteHandle } from '#/base/models/base.model';

const scheduleBaseRoute = `/${studentBaseRoute}/${studentRoutes.schedule.to}`;

const calendarLink = {
  to: scheduleBaseRoute,
  label: 'Calendar',
  icons: [{ name: 'calendar' }] as GroupLink['icons'],
};

const meetingListLink = {
  to: `${scheduleBaseRoute}/${studentRoutes.schedule.meeting.to}`,
  label: 'Meeting List',
  icons: [{ name: 'presentation' }] as GroupLink['icons'],
};

export const studentScheduleRouteHandle: { [key: string]: SceneRouteHandle } = {
  calendar: {
    title: 'Calendar',
    links: [meetingListLink],
  },
  list: {
    title: 'Meeting Schedules',
    links: [calendarLink],
  },
  single: { disabledSceneWrapper: true },
};
