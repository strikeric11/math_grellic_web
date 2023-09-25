import type { StateCreator } from 'zustand';
import type { LessonSlice, LessonUpsertFormData } from '../models/lesson.model';

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
