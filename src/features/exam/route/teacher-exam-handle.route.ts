import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import type { GroupLink, SceneRouteHandle } from '#/base/models/base.model';

const examBaseRoute = `/${teacherBaseRoute}/${teacherRoutes.exam.to}`;

const examListLink = {
  to: examBaseRoute,
  label: 'Exam List',
  icons: [{ name: 'exam' }] as GroupLink['icons'],
};

const createExamLink = {
  to: `${examBaseRoute}/${teacherRoutes.exam.createTo}`,
  label: 'Create Exam',
  icons: [{ name: 'plus', size: 16 }, { name: 'exam' }] as GroupLink['icons'],
};

const calendarLink = {
  to: `/${teacherBaseRoute}/${teacherRoutes.schedule.to}`,
  label: 'Calendar',
  icons: [{ name: 'calendar' }] as GroupLink['icons'],
};

export const teacherExamRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Exams',
    links: [createExamLink, calendarLink],
  },
  single: {
    title: 'Exam Details',
    links: [examListLink, createExamLink],
  },
  create: {
    title: 'Create an Exam',
    links: [examListLink, calendarLink],
  },
  edit: {
    title: 'Edit Exam',
    links: [examListLink, createExamLink],
  },
  schedule: { disabledSceneWrapper: true },
  preview: { disabledSceneWrapper: true },
};
