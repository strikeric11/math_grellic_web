import type { NavItem } from '#/base/models/base.model';

export const teacherPath = 'tea';

export const teacherBaseRoute = `${teacherPath}/dashboard`;

export const teacherRoutes = {
  dashboard: {
    name: 'dashboard',
    to: teacherBaseRoute,
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
    createTo: 'create',
    editTo: 'edit',
    previewTo: 'preview',
    scheduleTo: 'schedule',
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
  schedule: {
    name: 'schedule',
    to: 'schedule',
    label: 'Schedule',
    iconName: 'calendar',
  },
  performance: {
    name: 'performance',
    to: 'performance',
    label: 'Performance',
    iconName: 'chart-donut',
  },
  student: {
    name: 'students',
    to: 'students',
    label: 'Students',
    iconName: 'users-four',
  },
  help: {
    name: 'help',
    to: 'help',
    label: 'Help',
    iconName: 'chat-centered-text',
  },
};

export function generateTeacherRouteLinks() {
  const links = Object.entries(teacherRoutes).map((route) => route[1]);

  return links.map(({ to, ...t }) => ({
    ...t,
    to: to === teacherBaseRoute ? to : `${teacherBaseRoute}/${to}`,
  })) as NavItem[];
}
