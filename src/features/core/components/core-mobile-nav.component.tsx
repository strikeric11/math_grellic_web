import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cx from 'classix';

import { options } from '#/utils/scrollbar.util';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { UserRole } from '#/user/models/user.model';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { useBoundStore } from '../hooks/use-store.hook';
import { CoreClock } from './core-clock.component';
import { CoreNavItem } from './core-nav-item.component';

import logoPng from '#/assets/images/logo-only-xs.png';

import type { ComponentProps } from 'react';
import type { IconWeight } from '@phosphor-icons/react';
import type { NavItem } from '#/base/models/base.model';
import type { User } from '#/user/models/user.model';

type Props = ComponentProps<'div'> & {
  links: NavItem[];
  user: User;
  hasRightSidebar: boolean;
  onLogout: () => void;
  onUserAccountClick?: () => void;
};

const logoStyle = {
  backgroundImage: `url(${logoPng})`,
  backgroundSize: '30px 29px',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const menuIconProps = {
  weight: 'fill' as IconWeight,
};

const sidebarIconProps = {
  weight: 'bold' as IconWeight,
};

export const CoreMobileNav = memo(function ({
  className,
  links,
  user,
  hasRightSidebar,
  onLogout,
  onUserAccountClick,
  ...moreProps
}: Props) {
  const { pathname } = useLocation();

  const toggleRightSidebarMode = useBoundStore(
    (state) => state.toggleRightSidebarMode,
  );

  const [openModal, setOpenModal] = useState(false);

  const [publicId, role] = useMemo(() => [user.publicId, user.role], [user]);

  const dashboardTo = useMemo(() => {
    switch (role) {
      case UserRole.Student:
        return `/${studentBaseRoute}`;
      case UserRole.Teacher:
        return `/${teacherBaseRoute}`;
      default:
        // TODO admin
        return `/${teacherBaseRoute}`;
    }
  }, [role]);

  const userAccountTo = useMemo(() => {
    switch (role) {
      case UserRole.Student:
        return `/${studentBaseRoute}/${studentRoutes.account.to}`;
      case UserRole.Teacher:
        return `/${teacherBaseRoute}/${teacherRoutes.account.to}`;
      default:
        // TODO admin
        return `/${teacherBaseRoute}/${teacherRoutes.account.to}`;
    }
  }, [role]);

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => setOpenModal(isOpen),
    [],
  );

  useEffect(() => {
    handleSetModal(false)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div
        className={cx(
          'flex w-full items-center justify-between lg:hidden',
          className,
        )}
        {...moreProps}
      >
        <BaseIconButton
          className='box-content !h-full !w-7 px-4'
          name='list'
          variant='link'
          iconProps={menuIconProps}
          onClick={handleSetModal(true)}
        />
        <Link
          to={dashboardTo}
          className='absolute left-1/2 h-full -translate-x-1/2 px-2.5'
        >
          <div style={logoStyle} className='h-full w-[30px]' />
        </Link>
        <div>
          <BaseLink
            to={userAccountTo}
            className='box-content flex h-full w-7 items-center justify-center px-2.5 -2xs:px-4'
            leftIconName='user'
            iconWeight='bold'
          />
          {hasRightSidebar && (
            <BaseIconButton
              className='box-content !h-full !w-7 px-2.5 -2xs:px-4'
              name='cards'
              variant='link'
              iconProps={sidebarIconProps}
              onClick={toggleRightSidebarMode}
            />
          )}
        </div>
      </div>
      <BaseModal size='xs' open={openModal} onClose={handleSetModal(false)}>
        <nav className='block h-full lg:hidden'>
          <OverlayScrollbarsComponent
            className='h-full w-full'
            options={options}
            defer
          >
            <div className='flex h-12 w-full items-center justify-between py-2'>
              <button
                className={cx(
                  'flex items-center gap-1 overflow-hidden rounded-4px border border-accent/50 px-1.5 py-1',
                  'text-sm leading-none transition-all hover:border-primary-focus hover:text-primary-focus',
                )}
                onClick={onUserAccountClick}
              >
                <BaseIcon name='identification-badge' size={18} />
                <span>{publicId}</span>
              </button>
              <CoreClock className='h-full' />
            </div>
            <BaseDivider />
            <ul className='flex w-full flex-col'>
              {links.map(({ name, label, to, iconName, size, end }) => (
                <li key={name}>
                  <CoreNavItem
                    to={to}
                    label={label}
                    iconName={iconName}
                    size={size}
                    end={end}
                    isMobile
                  />
                </li>
              ))}
              <li>
                <BaseDivider />
                <BaseButton
                  className='!h-12 w-full justify-stretch px-4'
                  variant='link'
                  onClick={onLogout}
                >
                  <div className='flex items-center gap-5 text-base'>
                    <div className='flex w-9 items-center justify-center'>
                      <BaseIcon name='sign-out' size={32} />
                    </div>
                    Logout
                  </div>
                </BaseButton>
              </li>
            </ul>
          </OverlayScrollbarsComponent>
        </nav>
      </BaseModal>
    </>
  );
});
