import type { SceneRouteHandle } from '#/base/models/base.model';

export const currentUserRouteHandle: { [key: string]: SceneRouteHandle } = {
  single: {
    title: 'Account Details',
  },
  edit: {
    title: 'Edit Account',
  },
  assignedTeacher: {
    title: 'Assigned Teacher Details',
  },
};
