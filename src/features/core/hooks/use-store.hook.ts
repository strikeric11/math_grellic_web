import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { createCoreSlice } from '#/core/store/core.store';
import { createUserSlice } from '#/user/store/user.store';

import type { CoreSlice } from '#/core/models/core.model';
import type { UserSlice } from '#/user/models/user.model';

export const useBoundStore = create<CoreSlice & UserSlice>()(
  devtools(
    persist(
      subscribeWithSelector((...a) => ({
        ...createCoreSlice(...a),
        ...createUserSlice(...a),
      })),
      {
        name: 'main-storage',
        partialize: (state) => ({
          sidebarMode: state.sidebarMode,
          // lessonFormData: state.lessonFormData,
        }),
      },
    ),
  ),
);

// TODO
// export const useBoundStore = create<CoreSlice & UserSlice & LessonSlice>()(
//   devtools(
//     persist(
//       subscribeWithSelector((...a) => ({
//         ...createCoreSlice(...a),
//         ...createUserSlice(...a),
//         ...createLessonSlice(...a),
//       })),
//       {
//         name: 'main-storage',
//         partialize: (state) => ({
//           sidebarMode: state.sidebarMode,
//           lessonFormData: state.lessonFormData,
//         }),
//         skipHydration: true,
//       },
//     ),
//   ),
// );
