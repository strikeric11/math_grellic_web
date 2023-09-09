import { StateCreator } from 'zustand';
import type { UserSlice, User } from '../models/user.model';

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set,
) => ({
  user: undefined,
  setUser: (user?: User) => set({ user: user || null }),
});
