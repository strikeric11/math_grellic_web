import { LESSONS_PATH } from '#/utils/path.util';
import type { SceneRouteHandle } from '#/base/models/base.model';

export const lessonRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Lessons',
    links: [
      {
        to: `${LESSONS_PATH}/create`,
        label: 'Create Lesson',
        icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard-teacher' }],
      },
      {
        to: `${LESSONS_PATH}/schedule`,
        label: 'Schedule Lesson',
        icons: [{ name: 'plus', size: 16 }, { name: 'calendar' }],
      },
    ],
  },
  create: {
    title: 'Create a Lesson',
    links: [
      {
        to: LESSONS_PATH,
        label: 'Lesson List',
        icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard-teacher' }],
      },
      {
        to: `${LESSONS_PATH}/schedule`,
        label: 'Schedule Lesson',
        icons: [{ name: 'plus', size: 16 }, { name: 'calendar' }],
      },
    ],
  },
  schedule: {
    title: 'Schedule a Lesson',
    links: [
      {
        to: LESSONS_PATH,
        label: 'Lesson List',
        icons: [{ name: 'plus', size: 16 }, { name: 'chalkboard-teacher' }],
      },
      {
        to: '/calendar',
        label: 'Calendar',
        icons: [{ name: 'calendar' }],
      },
    ],
  },
};
