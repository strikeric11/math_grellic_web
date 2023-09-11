import { memo, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { staticRoutes } from '#/app/routes/static-routes';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseModal } from '#/base/components/base-modal.component';
import { AuthLoginForm } from './auth-login-form.component';

import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof BaseModal>, 'open' | 'onClose'>;

const ABSOLUTE_REGISTER_PATH = `/${staticRoutes.authRegister.to}`;

export const AuthLoginModal = memo(function (props: Props) {
  const { pathname } = useLocation();
  const user = useBoundStore((state) => state.user);
  const openLogin = useBoundStore((state) => state.openLogin);
  const setOpenLogin = useBoundStore((state) => state.setOpenLogin);
  const setOpenRegister = useBoundStore((state) => state.setOpenRegister);

  const closeModal = useCallback(() => {
    setOpenLogin(false);
  }, [setOpenLogin]);

  const handleRegister = useCallback(() => {
    // If already on register page, just scroll to top
    if (pathname === ABSOLUTE_REGISTER_PATH) {
      const element = document.getElementById('main');
      !!element && element.scrollIntoView({ behavior: 'smooth' });
      closeModal();
      return;
    }

    setOpenRegister(true);
  }, [pathname, closeModal, setOpenRegister]);

  useEffect(() => {
    if (user && openLogin) {
      setOpenLogin(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <BaseModal
      className='!border-0 !px-0 !pb-0'
      size='sm'
      {...props}
      open={!!openLogin}
      onClose={closeModal}
    >
      <AuthLoginForm onRegister={handleRegister} />
    </BaseModal>
  );
});
