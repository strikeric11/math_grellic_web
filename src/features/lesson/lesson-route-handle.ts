import { teacherBaseRoute, teacherRoutes } from '../app/routes/teacher-routes';
import type { SceneRouteHandle } from '#/base/models/base.model';

const lessonBaseRoute = `${teacherBaseRoute}/${teacherRoutes.lesson.to}`;

export const lessonTeacherRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Lessons',
    links: [
      {
        to: `${lessonBaseRoute}/${teacherRoutes.lesson.createTo}`,
        label: 'Create Lesson',
        icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard-teacher' }],
      },
      {
        to: `${lessonBaseRoute}/${teacherRoutes.lesson.scheduleTo}`,
        label: 'Schedule Lesson',
        icons: [{ name: 'plus', size: 16 }, { name: 'calendar' }],
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
        to: `${lessonBaseRoute}/${teacherRoutes.lesson.scheduleTo}`,
        label: 'Schedule Lesson',
        icons: [{ name: 'plus', size: 16 }, { name: 'calendar' }],
      },
    ],
  },
  update: {
    title: 'Edit Lesson',
    links: [
      {
        to: lessonBaseRoute,
        label: 'Lesson List',
        icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard-teacher' }],
      },
      {
        to: `${lessonBaseRoute}/${teacherRoutes.lesson.scheduleTo}`,
        label: 'Schedule Lesson',
        icons: [{ name: 'plus', size: 16 }, { name: 'calendar' }],
      },
    ],
  },
  schedule: {
    title: 'Schedule a Lesson',
    links: [
      {
        to: lessonBaseRoute,
        label: 'Lesson List',
        icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard-teacher' }],
      },
      {
        to: `${teacherBaseRoute}/${teacherRoutes.schedule.to}`,
        label: 'Calendar',
        icons: [{ name: 'calendar' }],
      },
    ],
  },
  preview: { disabledSceneWrapper: true },
};
