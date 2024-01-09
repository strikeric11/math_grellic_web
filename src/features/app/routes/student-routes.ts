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
  exam: {
    name: 'exams',
    to: 'exams',
    label: 'Exams',
    iconName: 'exam',
  },
  activity: {
    name: 'activities',
    to: 'activities',
    label: 'Activities',
    iconName: 'game-controller',
    size: 28,
  },
  schedule: {
    name: 'schedules',
    to: 'schedules',
    label: 'Schedules',
    iconName: 'calendar',
    meeting: {
      to: 'meetings',
    },
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
  account: {
    name: 'account',
    to: 'account',
    label: 'Account',
    teacherAccountTo: 'teacher',
    editTo: 'edit',
    hidden: true,
  },
};

export function generateStudentRouteLinks() {
  const links = Object.entries(studentRoutes)
    .map((route) => route[1])
    .filter(({ hidden }: any) => !hidden);

  return links.map(({ to, ...t }) => ({
    ...t,
    to: to === studentBaseRoute ? `/${to}` : `/${studentBaseRoute}/${to}`,
  })) as NavItem[];
}
