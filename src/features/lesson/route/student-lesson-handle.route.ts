import type { SceneRouteHandle } from '#/base/models/base.model';

// const studentLessonBaseRoute = `${studentBaseRoute}/${studentRoutes.lesson.to}`;

export const studentLessonRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Lessons',
  },
  single: { disabledSceneWrapper: true },
};
