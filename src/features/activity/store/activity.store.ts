import type { StateCreator } from 'zustand';
import type { ActivitySlice } from '../models/activity.model';
import type { ActivityUpsertFormData } from '../models/activity-form-data.model';

export const createActivitySlice: StateCreator<
  ActivitySlice,
  [],
  [],
  ActivitySlice
> = (set) => ({
  activityFormData: undefined,
  setActivityFormData: (activityFormData?: ActivityUpsertFormData) =>
    set({ activityFormData: activityFormData || null }),
});
