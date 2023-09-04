import type { SidebarMode } from '#/base/models/base.model';

export enum RecordStatus {
  Draft = 'draft',
  Published = 'published',
}

export type AuditTrail = {
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
};

export type CoreSlice = {
  sidebarMode: SidebarMode;
  openRegister?: boolean;
  openLogin?: boolean;
  setSidebarMode: (sidebarMode: SidebarMode) => void;
  setOpenRegister: (openRegister?: boolean) => void;
  setOpenLogin: (openLogin?: boolean) => void;
};
