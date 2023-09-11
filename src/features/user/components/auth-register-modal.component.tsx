import { memo, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { staticRoutes } from '#/app/routes/static-routes';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseModal } from '#/base/components/base-modal.component';
import { AuthRegisterRolePicker } from './auth-register-role-picker.component';

import type { ComponentProps } from 'react';
import type { UserRole } from '../models/user.model';

type Props = Omit<ComponentProps<typeof BaseModal>, 'open' | 'onClose'>;

const ABSOLUTE_REGISTER_PATH = `/${staticRoutes.authRegister.to}`;

export const AuthRegisterModal = memo(function (props: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const openRegister = useBoundStore((state) => state.openRegister);
  const setOpenRegister = useBoundStore((state) => state.setOpenRegister);
  const [loading, setLoading] = useState(false);

  const closeModal = useCallback(
    (forced?: boolean) => {
      if (!forced && loading) {
        return;
      }
      setLoading(false);
      setOpenRegister(false);
    },
    [loading, setOpenRegister],
  );

  const handleRoleChange = useCallback(
    (role: UserRole) => {
      navigate(`${ABSOLUTE_REGISTER_PATH}?role=${role}`);
      setLoading(true);
    },
    [navigate],
  );

  useEffect(() => {
    if (pathname !== ABSOLUTE_REGISTER_PATH) {
      return;
    }

    closeModal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <BaseModal {...props} open={!!openRegister} onClose={closeModal}>
      <AuthRegisterRolePicker
        onRoleChange={handleRoleChange}
        loading={loading}
      />
    </BaseModal>
  );
});
