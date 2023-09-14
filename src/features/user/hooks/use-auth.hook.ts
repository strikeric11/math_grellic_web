import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { generateError } from '#/utils/api.util';
import { supabase } from '#/config/supabase-client.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToUser } from '../helpers/user-transform.helper';
import { UserRole } from '../models/user.model';
import {
  getCurrentUser,
  registerStudentUser,
  registerTeacherUser,
} from '../api/auth.api';

import type {
  AuthCredentials,
  AuthRegisterFormData,
} from '../models/auth.model';
import type { User } from '../models/user.model';

type Result = {
  register: (
    data: AuthRegisterFormData,
    role: UserRole,
  ) => Promise<User | null>;
  login: (credentials: AuthCredentials) => Promise<User>;
  logout: () => Promise<void>;
  getUser: () => void;
};

export function useAuth(): Result {
  const setUser = useBoundStore((state) => state.setUser);
  const user = useBoundStore((state) => state.user);

  const { refetch: fetchUser } = useQuery(
    getCurrentUser({
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: false,
      retry: false,
      retryOnMount: false,
      initialData: user,
      select: (data: unknown) => transformToUser(data),
    }),
  );

  const { mutateAsync: mutateRegTeacherUser } = useMutation(
    registerTeacherUser(),
  );
  const { mutateAsync: mutateRegStudentUser } = useMutation(
    registerStudentUser(),
  );

  const register = useCallback(
    async (data: AuthRegisterFormData, role: UserRole) => {
      try {
        let newUser = null;
        if (role === UserRole.Teacher) {
          newUser = await mutateRegTeacherUser(data);
        } else if (role === UserRole.Student) {
          newUser = await mutateRegStudentUser(data);
        }
        return newUser;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    [mutateRegTeacherUser, mutateRegStudentUser],
  );

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error('Logout failed');
    }

    setUser();
  }, [setUser]);

  // Fetch data from api and set current user, if error or user does not exist
  // then logout current session
  const getUser = useCallback(async () => {
    const { data } = await fetchUser();

    if (!data) {
      logout();
    }

    setUser((data as User) ?? undefined);
    return data;
  }, [fetchUser, setUser, logout]);

  const login = useCallback(
    async ({ email, password }: AuthCredentials) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw generateError(
          {
            4: 'Email or password is incorrect',
            5: 'We have encountered an internal error',
          },
          error.status,
        );
      }

      const currentUser = await getUser();

      if (!currentUser) {
        throw new Error('Email or password is incorrect');
      }

      return currentUser;
    },
    [getUser],
  );

  return {
    register,
    login,
    logout,
    getUser,
  };
}
