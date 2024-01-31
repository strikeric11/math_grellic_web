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
    schedule: {
      to: 'schedules',
      createTo: 'create',
      editTo: 'edit',
    },
    hasRightSidebar: true,
  },
  exam: {
    name: 'exams',
    to: 'exams',
    label: 'Exams',
    iconName: 'exam',
    createTo: 'create',
    editTo: 'edit',
    previewTo: 'preview',
    schedule: {
      to: 'schedules',
      createTo: 'create',
      editTo: 'edit',
    },
    hasRightSidebar: true,
  },
  activity: {
    name: 'activities',
    to: 'activities',
    label: 'Activities',
    iconName: 'game-controller',
    createTo: 'create',
    editTo: 'edit',
    previewTo: 'preview',
    hasRightSidebar: true,
  },
  schedule: {
    name: 'schedules',
    to: 'schedules',
    label: 'Schedules',
    iconName: 'calendar',
    meeting: {
      to: 'meetings',
      createTo: 'create',
      editTo: 'edit',
    },
    hasRightSidebar: true,
  },
  performance: {
    name: 'performance',
    to: 'performance',
    label: 'Performance',
    iconName: 'chart-donut',
    hasRightSidebar: true,
  },
  student: {
    name: 'students',
    to: 'students',
    label: 'Students',
    iconName: 'users-four',
    createTo: 'enroll',
    editTo: 'edit',
    hasRightSidebar: true,
  },
  // help: {
  //   name: 'help',
  //   to: 'help',
  //   label: 'Help',
  //   iconName: 'chat-centered-text',
  // },
  account: {
    name: 'account',
    to: 'account',
    label: 'Account',
    editTo: 'edit',
    hidden: true,
  },
};

export function generateTeacherRouteLinks() {
  const links = Object.entries(teacherRoutes)
    .map((route) => route[1])
    .filter(({ hidden }: any) => !hidden);

  return links.map(({ to, ...t }) => ({
    ...t,
    to: to === teacherBaseRoute ? `/${to}` : `/${teacherBaseRoute}/${to}`,
  })) as NavItem[];
}
