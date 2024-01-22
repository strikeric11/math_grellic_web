import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { SidebarMode } from '#/base/models/base.model';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { useBoundStore } from '../hooks/use-store.hook';
import { CoreLogo } from './core-logo.component';
import { CoreNav } from './core-nav.component';

import { generateDashboardPath } from '#/utils/path.util';
import { homeNavItem } from '#/app/routes/static-routes';
import { generateTeacherRouteLinks } from '#/app/routes/teacher-routes';
import { generateStudentRouteLinks } from '#/app/routes/student-routes';
import { UserRole } from '#/user/models/user.model';
import { CoreNavItem } from './core-nav-item.component';

import gridSmPng from '#/assets/images/grid-sm.png';

import type { ComponentProps } from 'react';

const bgStyle = { backgroundImage: `url(${gridSmPng})` };

export const CoreSidebar = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'aside'>) {
  const user = useBoundStore((state) => state.user);
  const sidebarMode = useBoundStore((state) => state.sidebarMode);
  const setSidebarMode = useBoundStore((state) => state.setSidebarMode);

  const logoTo = useMemo(() => {
    if (!user) {
      return null;
    }

    return generateDashboardPath(user.role);
  }, [user]);

  const modeIconName = useMemo(() => {
    switch (sidebarMode) {
      case SidebarMode.Collapsed:
        return 'arrows-out-line-horizontal';
      case SidebarMode.Expanded:
        return 'arrows-in-line-horizontal';
      default:
        return null;
    }
  }, [sidebarMode]);

  // TODO specify student or teacher links
  const navLinks = useMemo(() => {
    if (user?.role === UserRole.Teacher) {
      return generateTeacherRouteLinks();
    } else if (user?.role === UserRole.Student) {
      return generateStudentRouteLinks();
    } else if (user?.role === UserRole.Admin) {
      // TODO admin links
    }

    return [];
  }, [user]);

  const handleSwitchMode = useCallback(() => {
    setSidebarMode(sidebarMode === 0 ? 1 : 0);
  }, [sidebarMode, setSidebarMode]);

  return (
    <aside
      style={bgStyle}
      className={cx(
        'fixed left-0 top-0 z-50 h-screen shrink-0 bg-backdrop-light transition-[width] duration-300',
        sidebarMode === SidebarMode.Collapsed && 'w-[70px]',
        sidebarMode === SidebarMode.Expanded && 'w-64',
        sidebarMode === SidebarMode.Hidden && 'w-0',
        className,
      )}
      {...moreProps}
    >
      <div className='absolute right-0 top-0 h-full w-3/4 border-r border-primary bg-gradient-to-r from-transparent to-white' />
      <div className='relative z-10 flex h-screen w-full flex-col justify-between py-3'>
        <div className='relative z-10 shrink-0 grow-0 pt-2.5'>
          {logoTo && (
            <CoreLogo
              to={logoTo}
              isExpanded={sidebarMode === SidebarMode.Expanded}
            />
          )}
        </div>
        <CoreNav
          links={navLinks}
          className='absolute left-0 top-1/2 z-0 -translate-y-1/2'
          isExpanded={sidebarMode === SidebarMode.Expanded}
        />
        <div className='relative z-10 flex shrink-0 grow-0 flex-col items-center justify-center overflow-hidden'>
          <CoreNavItem
            {...homeNavItem}
            isExpanded={sidebarMode === SidebarMode.Expanded}
          />
          {!!modeIconName && (
            <BaseIconButton
              name={modeIconName}
              className='!w-full'
              variant='link'
              onClick={handleSwitchMode}
            />
          )}
        </div>
      </div>
    </aside>
  );
});
