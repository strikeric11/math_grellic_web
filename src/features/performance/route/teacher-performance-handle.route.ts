import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import type { GroupLink, SceneRouteHandle } from '#/base/models/base.model';

const performanceBaseRoute = `/${teacherBaseRoute}/${teacherRoutes.performance.to}`;

const performanceListLink = {
  to: performanceBaseRoute,
  label: 'Student Performance',
  icons: [{ name: 'chart-donut' }] as GroupLink['icons'],
};

const studentListLink = {
  to: `/${teacherBaseRoute}/${teacherRoutes.student.to}`,
  label: 'Student List',
  icons: [{ name: 'users-four' }] as GroupLink['icons'],
};

export const teacherStudentPerformanceRouteHandle: {
  [key: string]: SceneRouteHandle;
} = {
  list: {
    title: 'Performance',
    links: [studentListLink],
  },
  single: {
    title: 'Performance Details',
    links: [performanceListLink, studentListLink],
  },
};
