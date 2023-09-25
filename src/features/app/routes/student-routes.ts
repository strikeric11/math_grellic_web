import type { NavItem } from '#/base/models/base.model';

export const studentPath = 'stu';

export const studentBaseRoute = `${studentPath}/dashboard`;

export const studentRoutes = {
  dashboard: {
    name: 'dashboard',
    to: studentBaseRoute,
    label: 'Dashboard',
    iconName: 'squares-four',
    end: true,
    size: 36,
  },
  lesson: {
    name: 'lessons',
    to: 'lessons',
    label: 'Lessons',
    iconName: 'chalkboard-teacher',
  },
  activity: {
    name: 'activities',
    to: 'activities',
    label: 'Activities',
    iconName: 'game-controller',
    size: 28,
  },
  exam: {
    name: 'exams',
    to: 'exams',
    label: 'Exams',
    iconName: 'exam',
  },
  calendar: {
    name: 'calendar',
    to: 'calendar',
    label: 'Calendar',
    iconName: 'calendar',
  },
  performance: {
    name: 'performance',
    to: 'performance',
    label: 'Performance',
    iconName: 'chart-donut',
  },
  help: {
    name: 'help',
    to: 'help',
    label: 'Help',
    iconName: 'chat-centered-text',
  },
};

export function generateStudentRouteLinks() {
  const links = Object.entries(studentRoutes).map((route) => route[1]);

  return links.map(({ to, ...t }) => ({
    ...t,
    to: to === studentBaseRoute ? `/${to}` : `/${studentBaseRoute}/${to}`,
  })) as NavItem[];
}
