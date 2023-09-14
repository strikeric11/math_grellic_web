import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';

import { UserRole } from '#/user/models/user.model';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { useBoundStore } from '#/core/hooks/use-store.hook';

import type { ReactNode } from 'react';

type Props = { children: ReactNode; roles?: UserRole[]; redirectTo?: string };

export function AuthProtectedRoute({
  roles,
  children,
  redirectTo = '/',
}: Props) {
  const user = useBoundStore((state) => state.user);

  const isRoleValid = useMemo(() => {
    if (user == null) {
      return false;
    }
    return roles?.length ? roles?.some((role) => role === user.role) : true;
  }, [user, roles]);

  if (user) {
    return isRoleValid ? children : <Navigate to={redirectTo} replace />;
  } else if (user === null) {
    return <Navigate to={redirectTo} />;
  } else {
    return <BasePageSpinner absolute />;
  }
}
