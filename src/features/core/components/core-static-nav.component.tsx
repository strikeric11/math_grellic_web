import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { staticHomeNavItem, staticRoutes } from '#/app/routes/static-routes';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { CoreStaticNavMenu } from './core-static-nav-menu.component';

import type { ComponentProps } from 'react';
import type { IconWeight } from '@phosphor-icons/react';
import type { NavItem } from '#/base/models/base.model';

type Props = ComponentProps<'div'> & {
  items: NavItem[];
  loading?: boolean;
  onGetStarted?: () => Promise<void>;
  onLogin?: () => void;
};

const ABSOLUTE_REGISTER_PATH = `/${staticRoutes.authRegister.to}`;

const menuIconProps = { weight: 'fill' as IconWeight };

export const CoreStaticNav = memo(function ({
  items,
  loading,
  onGetStarted,
  onLogin,
  ...moreProps
}: Props) {
  const { pathname } = useLocation();
  const [openModal, setOpenModal] = useState(false);

  const mobileItems = useMemo(() => [staticHomeNavItem, ...items], [items]);

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => setOpenModal(isOpen),
    [],
  );

  const handleGetStarted = useCallback(async () => {
    onGetStarted && (await onGetStarted());
    handleSetModal(false)();
  }, [onGetStarted, handleSetModal]);

  const handleLogin = useCallback(() => {
    onLogin && onLogin();
    handleSetModal(false)();
  }, [onLogin, handleSetModal]);

  useEffect(() => {
    handleSetModal(false)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div {...moreProps}>
        <nav className='hidden lg:block'>
          <CoreStaticNavMenu
            items={items}
            loading={loading}
            isRegisterPath={pathname === ABSOLUTE_REGISTER_PATH}
            onGetStarted={handleGetStarted}
            onLogin={handleLogin}
          />
        </nav>
        <div className='block lg:hidden'>
          <BaseIconButton
            name='list'
            variant='link'
            iconProps={menuIconProps}
            onClick={handleSetModal(true)}
          />
        </div>
      </div>
      <BaseModal size='xs' open={openModal} onClose={handleSetModal(false)}>
        <nav className='block lg:hidden'>
          <CoreStaticNavMenu
            items={mobileItems}
            loading={loading}
            isRegisterPath={pathname === ABSOLUTE_REGISTER_PATH}
            onGetStarted={handleGetStarted}
            onLogin={handleLogin}
          />
        </nav>
      </BaseModal>
    </>
  );
});
