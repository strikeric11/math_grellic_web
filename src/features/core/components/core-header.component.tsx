import { memo, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import cx from 'classix';

import { UserRole } from '#/user/models/user.model';
import {
  generateTeacherRouteLinks,
  teacherBaseRoute,
  teacherRoutes,
} from '#/app/routes/teacher-routes';
import {
  generateStudentRouteLinks,
  studentBaseRoute,
  studentRoutes,
} from '#/app/routes/student-routes';
import { useAuth } from '#/user/hooks/use-auth.hook';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { useBoundStore } from '../hooks/use-store.hook';
import { useScroll } from '../hooks/use-scroll.hook';
import { CoreClock } from './core-clock.component';
import { CoreMobileNav } from './core-mobile-nav.component';

import type { ComponentProps } from 'react';

export const CoreHeader = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'header'>) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useBoundStore((state) => state.user);
  const { isScrollTop } = useScroll();
  const { logout } = useAuth();

  // TODO notification

  const [publicId, role] = useMemo(() => [user?.publicId, user?.role], [user]);

  // TODO specify student or teacher links
  const navLinks = useMemo(() => {
    if (role === UserRole.Teacher) {
      return generateTeacherRouteLinks();
    } else if (role === UserRole.Student) {
      return generateStudentRouteLinks();
    } else if (role === UserRole.Admin) {
      // TODO admin links
    }

    return [];
  }, [role]);

  const hasRightSidebar = useMemo(() => {
    const targetNavLink = navLinks.find((link) => link.to === pathname);
    return (targetNavLink as any)?.hasRightSidebar;
  }, [pathname, navLinks]);

  const handleUserAccount = useCallback(() => {
    if (!role) {
      return;
    }

    switch (role) {
      case UserRole.Student:
        navigate(`/${studentBaseRoute}/${studentRoutes.account.to}`);
        break;
      case UserRole.Teacher:
        navigate(`/${teacherBaseRoute}/${teacherRoutes.account.to}`);
        break;
      default:
        // navigate(`/${teacherBaseRoute}/${teacherRoutes.account.to}`)
        break;
    }
  }, [role, navigate]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <header
      className={cx(
        'fixed bottom-0 left-0 right-auto top-auto z-20 w-full rounded-none px-0 transition-all duration-300 lg:bottom-auto lg:left-auto lg:right-10 lg:top-4 lg:w-fit lg:rounded-lg',
        'flex items-center justify-between border-0 border-t border-t-primary-border-light bg-white lg:block lg:border lg:border-transparent lg:bg-backdrop',
        !isScrollTop && 'drop-shadow-sm lg:!border-accent/20 lg:!px-2.5',
        className,
      )}
      {...moreProps}
    >
      {user && (
        <CoreMobileNav
          className='h-[48px]'
          user={user}
          links={navLinks}
          hasRightSidebar={hasRightSidebar}
          onLogout={handleLogout}
          onUserAccountClick={handleUserAccount}
        />
      )}
      <div className='hidden h-[48px] items-center justify-center gap-2.5 lg:flex'>
        <div className='items-center gap-1.5'>
          {/* <BaseIconButton name='bell' variant='solid' size='sm' /> */}
          <BaseDropdownMenu
            customMenuButton={
              <div>
                <Menu.Button
                  as={BaseIconButton}
                  name='list'
                  variant='solid'
                  size='sm'
                />
              </div>
            }
          >
            <div className='flex items-center justify-end gap-1 py-1 pr-2.5 text-sm opacity-80'>
              <BaseIcon name='identification-badge' size={20} />
              {publicId}
            </div>
            <BaseDivider className='my-1' />
            <Menu.Item
              as={BaseDropdownButton}
              iconName='user'
              onClick={handleUserAccount}
            >
              Account
            </Menu.Item>
            <Menu.Item
              as={BaseDropdownButton}
              iconName='sign-out'
              onClick={handleLogout}
            >
              Logout
            </Menu.Item>
          </BaseDropdownMenu>
        </div>
        <BaseDivider className='hidden lg:block' vertical />
        <CoreClock className='h-full' isCompact={!isScrollTop} />
      </div>
    </header>
  );
});
