import type { StateCreator } from 'zustand';
import type { ExamSlice, ExamUpsertFormData } from '../models/exam.model';

export const createExamSlice: StateCreator<ExamSlice, [], [], ExamSlice> = (
  set,
) => ({
  examFormData: undefined,
  setExamFormData: (examFormData?: ExamUpsertFormData) =>
    set({ examFormData: examFormData || null }),
});
