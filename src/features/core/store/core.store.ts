import { SidebarMode } from '#/base/models/base.model';

import type { StateCreator } from 'zustand';
import type { CoreSlice } from '#/core/models/core.model';

export const createCoreSlice: StateCreator<CoreSlice, [], [], CoreSlice> = (
  set,
  get,
) => ({
  sidebarMode: SidebarMode.Collapsed,
  rightSidebarMode: SidebarMode.Expanded,
  openRegister: undefined,
  openLogin: undefined,
  setSidebarMode: (sidebarMode: SidebarMode) => set({ sidebarMode }),
  toggleRightSidebarMode: () => {
    const isExpanded = get().rightSidebarMode === SidebarMode.Expanded;
    set({
      rightSidebarMode: isExpanded
        ? SidebarMode.Collapsed
        : SidebarMode.Expanded,
    });
  },
  setOpenRegister: (openRegister?: boolean) =>
    set({ openRegister, openLogin: false }),
  setOpenLogin: (openLogin?: boolean) =>
    set({ openLogin, openRegister: false }),
});
