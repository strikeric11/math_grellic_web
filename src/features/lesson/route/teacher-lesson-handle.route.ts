import {
  teacherBaseRoute,
  teacherRoutes,
} from '../../app/routes/teacher-routes';
import type { GroupLink, SceneRouteHandle } from '#/base/models/base.model';

const lessonBaseRoute = `/${teacherBaseRoute}/${teacherRoutes.lesson.to}`;

const lessonList = {
  to: lessonBaseRoute,
  label: 'Lesson List',
  icons: [{ name: 'chalkboard-teacher' }] as GroupLink['icons'],
};

const createLessonLink = {
  to: `${lessonBaseRoute}/${teacherRoutes.lesson.createTo}`,
  label: 'Create Lesson',
  icons: [
    { name: 'plus', size: 16 },
    { name: 'chalkboard-teacher' },
  ] as GroupLink['icons'],
};

const calendarLink = {
  to: `${teacherBaseRoute}/${teacherRoutes.calendar.to}`,
  label: 'Calendar',
  icons: [{ name: 'calendar' }] as GroupLink['icons'],
};

export const teacherLessonRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Lessons',
    links: [createLessonLink, calendarLink],
  },
  single: {
    title: 'Lesson Details',
    links: [lessonList, createLessonLink],
  },
  create: {
    title: 'Create a Lesson',
    links: [lessonList, calendarLink],
  },
  edit: {
    title: 'Edit Lesson',
    links: [lessonList, createLessonLink],
  },
  schedule: { disabledSceneWrapper: true },
  preview: { disabledSceneWrapper: true },
};
