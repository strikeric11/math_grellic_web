import { memo, useEffect, useState } from 'react';
import cx from 'classix';

import { useScroll } from '#/core/hooks/use-scroll.hook';
import { SidebarMode } from '../models/base.model';
import { BaseDivider } from './base-divider.component';

import type { ComponentProps } from 'react';
import { useBoundStore } from '#/core/hooks/use-store.hook';

export const BaseRightSidebar = memo(function ({
  className,
  children,
  ...moreProps
}: ComponentProps<'aside'>) {
  const { isScrollTop } = useScroll();
  const rightSidebarMode = useBoundStore((state) => state.rightSidebarMode);
  const toggleRightSidebarMode = useBoundStore(
    (state) => state.toggleRightSidebarMode,
  );
  const [heightStyle, setHeightStyle] = useState({});

  useEffect(() => {
    // Set component height by getting scene tile and scene toolbar height,
    // and subtracting it to browser window inner height
    const height = `${generateSidebarHeight(isScrollTop)}px`;
    setHeightStyle({ height });
  }, [isScrollTop]);

  return (
    <aside
      style={heightStyle}
      className={cx(
        className,
        'sticky top-0 flex grow-0 items-start pb-4 transition-[width,height] duration-300',
        rightSidebarMode === SidebarMode.Collapsed ? 'w-0' : 'w-[408px]',
        isScrollTop ? 'pt-0' : 'pt-4',
      )}
      {...moreProps}
    >
      {/* TODO border button */}
      <div className='h-full px-2'>
        <div
          className='group/btn flex h-full w-4 justify-center transition-colors hover:bg-primary-focus-light/30'
          role='button'
          onClick={toggleRightSidebarMode}
        >
          <BaseDivider vertical />
        </div>
      </div>
      {/* TODO content button */}
      <div
        className={cx(
          'h-full w-full overflow-hidden transition-[padding]',
          isScrollTop ? 'pt-0' : 'pt-16',
        )}
      >
        {children}
        <div className='h-8 w-8 bg-green-500'>this is a child</div>
      </div>
    </aside>
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
