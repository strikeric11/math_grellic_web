import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useWindowSize } from '@uidotdev/usehooks';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import defaultTheme from 'tailwindcss/defaultTheme';
import cx from 'classix';

import { options } from '#/utils/scrollbar.util';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useScroll } from '#/core/hooks/use-scroll.hook';
import { SidebarMode } from '../models/base.model';
import { BaseDivider } from './base-divider.component';
import { BaseModal } from './base-modal.component';

import type { ComponentProps } from 'react';

export const BaseRightSidebar = memo(function ({
  className,
  children,
  ...moreProps
}: ComponentProps<'aside'>) {
  const { width: windowWidth } = useWindowSize();
  const { isScrollTop } = useScroll();
  const [heightStyle, setHeightStyle] = useState({});
  const rightSidebarMode = useBoundStore((state) => state.rightSidebarMode);

  const toggleRightSidebarMode = useBoundStore(
    (state) => state.toggleRightSidebarMode,
  );

  const openModal = useMemo(
    () => rightSidebarMode === SidebarMode.Expanded,
    [rightSidebarMode],
  );

  const isModal = useMemo(() => {
    if (windowWidth == null) {
      return false;
    }

    const targetWidth = +defaultTheme.screens.lg.replace(/[^0-9]/g, '');
    return windowWidth < targetWidth;
  }, [windowWidth]);

  const handleModalClose = useCallback(() => {
    if (rightSidebarMode !== SidebarMode.Expanded) {
      return;
    }

    toggleRightSidebarMode();
  }, [rightSidebarMode, toggleRightSidebarMode]);

  useEffect(() => {
    // Set component height by getting scene tile and scene toolbar height,
    // and subtracting it to browser window inner height
    const height = `${generateSidebarHeight(isScrollTop)}px`;
    setHeightStyle({ height });
  }, [isScrollTop]);

  return (
    <>
      <aside
        style={heightStyle}
        className={cx(
          className,
          'sticky top-0 hidden grow-0 items-start pb-4 transition-[width,height] duration-300 lg:flex',
          rightSidebarMode === SidebarMode.Collapsed ? 'w-0' : 'w-[408px]',
          isScrollTop ? 'pt-0' : 'pt-4',
        )}
        {...moreProps}
      >
        <div className='h-full px-2'>
          <div
            className='group/btn flex h-full w-4 justify-center transition-colors hover:bg-primary-focus-light/30'
            role='button'
            onClick={toggleRightSidebarMode}
          >
            <BaseDivider vertical />
          </div>
        </div>
        {rightSidebarMode === SidebarMode.Expanded && (
          <div
            className={cx(
              'h-full w-full overflow-hidden opacity-100 transition-[padding,opacity]',
              isScrollTop ? 'pt-0' : 'pt-16',
            )}
          >
            <OverlayScrollbarsComponent
              className='h-full w-full'
              options={options}
              defer
            >
              {children}
            </OverlayScrollbarsComponent>
          </div>
        )}
      </aside>
      {isModal && (
        <BaseModal open={openModal} size='sm' onClose={handleModalClose}>
          <OverlayScrollbarsComponent
            className='h-full w-full'
            options={options}
            defer
          >
            <div>{children}</div>
          </OverlayScrollbarsComponent>
        </BaseModal>
      )}
    </>
  );
});

function generateSidebarHeight(isTop: boolean) {
  // Get window browser height
  const { innerHeight: windowHeight } = window;

  if (!isTop) {
    return windowHeight;
  }

  // Get scene title height
  const titleElHeight =
    document.getElementById('scene-title')?.getBoundingClientRect().height || 0;
  // Get scene toolbar height
  const toolbarElHeight =
    document.getElementById('scene-toolbar')?.getBoundingClientRect().height ||
    0;
  // Get scene content padding top and bottom in px
  const contentElStyles = window.getComputedStyle(
    document.getElementById('scene-content') || document.createElement('div'),
  );
  const contentElPaddingBlock =
    parseInt(contentElStyles.getPropertyValue('padding-top')) +
    parseInt(contentElStyles.getPropertyValue('padding-bottom'));
  // Calculate final height for component
  const height =
    windowHeight - (titleElHeight + toolbarElHeight + contentElPaddingBlock);

  return height;
}
