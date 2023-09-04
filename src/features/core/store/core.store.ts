import { SidebarMode } from '#/base/models/base.model';

import type { StateCreator } from 'zustand';
import type { CoreSlice } from '#/core/models/core.model';

export const createCoreSlice: StateCreator<CoreSlice, [], [], CoreSlice> = (
  set,
) => ({
  sidebarMode: SidebarMode.Collapsed,
  openRegister: undefined,
  openLogin: undefined,
  setSidebarMode: (sidebarMode: SidebarMode) => set({ sidebarMode }),
  setOpenRegister: (openRegister?: boolean) =>
    set({ openRegister, openLogin: false }),
  setOpenLogin: (openLogin?: boolean) =>
    set({ openLogin, openRegister: false }),
});
