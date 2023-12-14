import { SidebarMode } from '#/base/models/base.model';

import type { StateCreator } from 'zustand';
import type { Socket } from 'socket.io-client';
import type { CoreSlice, ExActImageEdit } from '#/core/models/core.model';

export const createCoreSlice: StateCreator<CoreSlice, [], [], CoreSlice> = (
  set,
  get,
) => ({
  socket: undefined,
  sidebarMode: SidebarMode.Collapsed,
  rightSidebarMode: SidebarMode.Expanded,
  openRegister: undefined,
  openLogin: undefined,
  exActImageEdit: undefined,
  setSocket: (socket: Socket) => set({ socket }),
  setSidebarMode: (sidebarMode: SidebarMode) => set({ sidebarMode }),
  setExActImageEdit: (exActImageEdit?: ExActImageEdit) =>
    set({ exActImageEdit }),
  setOpenRegister: (openRegister?: boolean) =>
    set({ openRegister, openLogin: false }),
  setOpenLogin: (openLogin?: boolean) =>
    set({ openLogin, openRegister: false }),
  toggleRightSidebarMode: () => {
    const isExpanded = get().rightSidebarMode === SidebarMode.Expanded;
    set({
      rightSidebarMode: isExpanded
        ? SidebarMode.Collapsed
        : SidebarMode.Expanded,
    });
  },
});
