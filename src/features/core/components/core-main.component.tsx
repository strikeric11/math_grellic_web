import cx from 'classix';

import { SidebarMode } from '#/base/models/base.model';
import { useBoundStore } from '../hooks/use-store.hook';

import type { ComponentProps } from 'react';

export function CoreMain({
  className,
  children,
  ...moreProps
}: ComponentProps<'main'>) {
  const sidebarMode = useBoundStore((state) => state.sidebarMode);

  return (
    <main
      className={cx(
        'relative min-h-screen w-full flex-1 transition-[margin] duration-300',
        sidebarMode === SidebarMode.Collapsed && 'ml-[70px]',
        sidebarMode === SidebarMode.Expanded && 'ml-64',
        sidebarMode === SidebarMode.Hidden && 'ml-0',
        className,
      )}
      {...moreProps}
    >
      {children}
    </main>
  );
}
