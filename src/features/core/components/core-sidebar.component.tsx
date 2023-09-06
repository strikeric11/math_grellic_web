import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { DASHBOARD_PATH } from '#/utils/path.util';
import { SidebarMode } from '#/base/models/base.model';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { CoreLogo } from './core-logo.component';
import { CoreNav } from './core-nav.component';

import gridSmPng from '#/assets/images/grid-sm.png';
import navLinksDashboardJson from '#/utils/nav-links-dashboard.json';

import type { ComponentProps } from 'react';
import type { NavItem } from '#/base/models/base.model';

const bgStyle = { backgroundImage: `url(${gridSmPng})` };

export const CoreSidebar = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'aside'>) {
  const sidebarMode = useBoundStore((state) => state.sidebarMode);
  const setSidebarMode = useBoundStore((state) => state.setSidebarMode);

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

  const navLinks = useMemo(() => {
    return navLinksDashboardJson.teacher.map(({ to, ...t }) => ({
      ...t,
      to: to === '/' ? DASHBOARD_PATH : `${DASHBOARD_PATH}${to}`,
    })) as NavItem[];
  }, []);

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
          <CoreLogo
            to={DASHBOARD_PATH}
            isExpanded={sidebarMode === SidebarMode.Expanded}
          />
        </div>
        <CoreNav
          links={navLinks}
          className='absolute left-0 top-1/2 z-0 -translate-y-1/2'
          isExpanded={sidebarMode === SidebarMode.Expanded}
        />
        <div className='relative z-10 flex shrink-0 grow-0 items-center justify-center'>
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
