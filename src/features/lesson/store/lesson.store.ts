import type { StateCreator } from 'zustand';
import type { LessonSlice } from '../models/lesson.model';
import type { LessonUpsertFormData } from '../models/lesson-form-data.model';

export const createLessonSlice: StateCreator<
  LessonSlice,
  [],
  [],
  LessonSlice
> = (set) => ({
  lessonFormData: undefined,
  setLessonFormData: (lessonFormData?: LessonUpsertFormData) =>
    set({ lessonFormData: lessonFormData || null }),
});
