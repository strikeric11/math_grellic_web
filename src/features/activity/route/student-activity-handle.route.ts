import type { SceneRouteHandle } from '#/base/models/base.model';

export const studentActivityRouteHandle: { [key: string]: SceneRouteHandle } = {
  list: {
    title: 'Activities',
  },
  single: { disabledSceneWrapper: true },
};
