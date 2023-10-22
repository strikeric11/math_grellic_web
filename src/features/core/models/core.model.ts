import type { Socket } from 'socket.io-client';
import type { SidebarMode } from '#/base/models/base.model';

export enum RecordStatus {
  Draft = 'draft',
  Published = 'published',
}

export type AuditTrail = {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type CoreSlice = {
  socket?: Socket;
  openRegister?: boolean;
  openLogin?: boolean;
  sidebarMode: SidebarMode;
  rightSidebarMode: Omit<SidebarMode, 'Hidden'>;
  setSocket: (socket: Socket) => void;
  setOpenRegister: (openRegister?: boolean) => void;
  setOpenLogin: (openLogin?: boolean) => void;
  setSidebarMode: (sidebarMode: SidebarMode) => void;
  toggleRightSidebarMode: () => void;
};

export type PaginatedQueryData<T> = (T[] | number)[];
