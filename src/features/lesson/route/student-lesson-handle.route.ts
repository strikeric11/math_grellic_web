import type { SceneRouteHandle } from '#/base/models/base.model';

export const studentLessonRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Lessons',
  },
  single: { disabledSceneWrapper: true },
};
