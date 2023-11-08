import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import type { GroupLink, SceneRouteHandle } from '#/base/models/base.model';

const scheduleBaseRoute = `/${studentBaseRoute}/${studentRoutes.exam.to}`;

const calendarLink = {
  to: scheduleBaseRoute,
  label: 'Calendar',
  icons: [{ name: 'calendar' }] as GroupLink['icons'],
};

export const studentScheduleRouteHandle: { [key: string]: SceneRouteHandle } = {
  calendar: {
    title: 'Calendar',
  },
  single: {
    title: 'Meeting Schedule',
    links: [calendarLink],
  },
};
