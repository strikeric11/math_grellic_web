import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { createUserSlice } from '#/user/store/user.store';
import { createLessonSlice } from '#/lesson/store/lesson.store';
import { createExamSlice } from '#/exam/store/exam.store';
import { createActivitySlice } from '#/activity/store/activity.store';
import { createCoreSlice } from '../store/core.store';

import type { UserSlice } from '#/user/models/user.model';
import type { LessonSlice } from '#/lesson/models/lesson.model';
import type { ExamSlice } from '#/exam/models/exam.model';
import type { ActivitySlice } from '#/activity/models/activity.model';
import type { CoreSlice } from '../models/core.model';

export const useBoundStore = create<
  CoreSlice & UserSlice & LessonSlice & ExamSlice & ActivitySlice
>()(
  devtools(
    persist(
      subscribeWithSelector((...a) => ({
        ...createCoreSlice(...a),
        ...createUserSlice(...a),
        ...createLessonSlice(...a),
        ...createExamSlice(...a),
        ...createActivitySlice(...a),
      })),
      {
        name: 'main-storage',
        partialize: (state) => ({
          sidebarMode: state.sidebarMode,
          rightSidebarMode: state.rightSidebarMode,
          lessonFormData: state.lessonFormData,
          examFormData: state.examFormData,
          activityFormData: state.activityFormData,
        }),
        // Always set user field's initial value to undefined, to prevent localstorage manipulation
        merge: (persistedState, currentState) => ({
          ...currentState,
          ...(persistedState as any),
          user: undefined,
        }),
      },
    ),
  ),
);
