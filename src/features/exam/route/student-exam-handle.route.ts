import type { SceneRouteHandle } from '#/base/models/base.model';

export const studentExamRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Exams',
  },
  single: { disabledSceneWrapper: true },
};
