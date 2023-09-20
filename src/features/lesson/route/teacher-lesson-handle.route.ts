import {
  teacherBaseRoute,
  teacherRoutes,
} from '../../app/routes/teacher-routes';
import type { SceneRouteHandle } from '#/base/models/base.model';

const lessonBaseRoute = `${teacherBaseRoute}/${teacherRoutes.lesson.to}`;

export const teacherLessonRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Lessons',
    links: [
      {
        to: `${lessonBaseRoute}/${teacherRoutes.lesson.createTo}`,
        label: 'Create Lesson',
        icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard-teacher' }],
      },
      {
        to: `${teacherBaseRoute}/${teacherRoutes.calendar.to}`,
        label: 'Calendar',
        icons: [{ name: 'calendar' }],
      },
    ],
  },
  single: {
    title: 'Lesson Details',
    links: [
      {
        to: lessonBaseRoute,
        label: 'Lesson List',
        icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard-teacher' }],
      },
      {
        to: `${lessonBaseRoute}/${teacherRoutes.lesson.createTo}`,
        label: 'Create Lesson',
        icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard-teacher' }],
      },
    ],
  },
  create: {
    title: 'Create a Lesson',
    links: [
      {
        to: lessonBaseRoute,
        label: 'Lesson List',
        icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard-teacher' }],
      },
      {
        to: `${teacherBaseRoute}/${teacherRoutes.calendar.to}`,
        label: 'Calendar',
        icons: [{ name: 'calendar' }],
      },
    ],
  },
  edit: {
    title: 'Edit Lesson',
    links: [
      {
        to: lessonBaseRoute,
        label: 'Lesson List',
        icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard-teacher' }],
      },
      {
        to: `${lessonBaseRoute}/${teacherRoutes.lesson.createTo}`,
        label: 'Create Lesson',
        icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard-teacher' }],
      },
    ],
  },
  schedule: { disabledSceneWrapper: true },
  preview: { disabledSceneWrapper: true },
};
