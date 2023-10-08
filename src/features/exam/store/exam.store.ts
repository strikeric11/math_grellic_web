import type { StateCreator } from 'zustand';
import type { ExamSlice } from '../models/exam.model';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

export const createExamSlice: StateCreator<ExamSlice, [], [], ExamSlice> = (
  set,
) => ({
  examFormData: undefined,
  setExamFormData: (examFormData?: ExamUpsertFormData) =>
    set({ examFormData: examFormData || null }),
});
