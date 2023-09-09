import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { createUserSlice } from '#/user/store/user.store';
import { createLessonSlice } from '#/lesson/store/lesson.store';
import { createCoreSlice } from '../store/core.store';

import type { UserSlice } from '#/user/models/user.model';
import type { LessonSlice } from '#/lesson/models/lesson.model';
import type { CoreSlice } from '../models/core.model';

export const useBoundStore = create<CoreSlice & UserSlice & LessonSlice>()(
  devtools(
    persist(
      subscribeWithSelector((...a) => ({
        ...createCoreSlice(...a),
        ...createUserSlice(...a),
        ...createLessonSlice(...a),
      })),
      {
        name: 'main-storage',
        partialize: (state) => ({
          sidebarMode: state.sidebarMode,
          lessonFormData: state.lessonFormData,
        }),
      },
    ),
  ),
);
