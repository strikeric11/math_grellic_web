import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import cx from 'classix';

import { UserRole } from '#/user/models/user.model';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { useAuth } from '#/user/hooks/use-auth.hook';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { useBoundStore } from '../hooks/use-store.hook';
import { useScroll } from '../hooks/use-scroll.hook';
import { CoreClock } from './core-clock.component';

import type { ComponentProps } from 'react';

export const CoreHeader = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'header'>) {
  const navigate = useNavigate();
  const user = useBoundStore((state) => state.user);
  const { isScrollTop } = useScroll();
  const { logout } = useAuth();

  const publicId = useMemo(() => user?.publicId, [user]);

  // TODO notification

  const handleUserAccount = useCallback(() => {
    if (!user) {
      return;
    }

    switch (user.role) {
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
  }, [user, navigate]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <header
      className={cx(
        'fixed right-10 top-4 z-20 w-fit rounded-lg border  border-transparent bg-backdrop px-0 transition-all duration-300',
        !isScrollTop && '!border-accent/20 !px-2.5 drop-shadow-sm',
        className,
      )}
      {...moreProps}
    >
      <div className='flex h-[48px] items-center justify-center gap-2.5'>
        <div className='flex items-center gap-1.5'>
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
        <BaseDivider vertical />
        <CoreClock className='h-full' isCompact={!isScrollTop} />
      </div>
    </header>
  );
});
