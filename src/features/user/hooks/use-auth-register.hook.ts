import { useEffect, useMemo, useCallback, useState } from 'react';

import { UserRole } from '../models/user.model';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

type Result = {
  isDone: boolean;
  loading: boolean;
  selectedUserRole: UserRole;
  setIsDone: (isDone: boolean) => void;
  handleRoleChange: (role: UserRole) => void;
  handleLogin: () => void;
};

export function useAuthRegister(): Result {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const setOpenLogin = useBoundStore((state) => state.setOpenLogin);
  const user = useBoundStore((state) => state.user);
  const [isDone, setIsDone] = useState(false);

  // If role query params is not user role then set it
  useEffect(() => {
    const role = searchParams.get('role');

    if (role === UserRole.Teacher || role === UserRole.Student) {
      return;
    }

    const href = `${pathname}?role=${UserRole.Student}`;
    navigate(href, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guard page, redirect to home if user is logged-in
  useEffect(() => {
    if (!user) {
      return;
    }

    navigate('/', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const selectedUserRole = useMemo(
    () => searchParams.get('role')?.toLowerCase() as UserRole,
    [searchParams],
  );

  const handleRoleChange = useCallback(
    (userRole: UserRole) => {
      const href = `${pathname}?role=${userRole}`;
      navigate(href);
    },
    [navigate, pathname],
  );

  const handleLogin = useCallback(() => setOpenLogin(true), [setOpenLogin]);

  return {
    isDone,
    loading: user === undefined,
    selectedUserRole,
    setIsDone,
    handleRoleChange,
    handleLogin,
  };
}
