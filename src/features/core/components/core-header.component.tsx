import { memo, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import cx from 'classix';

import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { CoreClock } from './core-clock.component';

import type { ComponentProps } from 'react';

const SCROLL_Y_THRESHOLD = 40;

export const CoreHeader = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'header'>) {
  const { scrollY } = useScroll();
  const [isScrollTop, setIsScrollTop] = useState(true);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrollTop(latest <= SCROLL_Y_THRESHOLD);
  });

  return (
    <header
      className={cx(
        'fixed right-10 top-4 z-20 w-fit rounded-lg border  border-transparent bg-backdrop px-0 transition-all duration-300',
        !isScrollTop && '!border-accent/20 !px-2.5 drop-shadow-sm',
        className,
      )}
      {...moreProps}
    >
      <div className='flex h-[48px] items-center justify-center gap-2.5 overflow-hidden'>
        <div className='flex items-center gap-1.5'>
          <BaseIconButton name='bell' variant='solid' size='sm' />
          <BaseIconButton name='user' variant='solid' size='sm' />
        </div>
        <BaseDivider vertical />
        <CoreClock
          dateTime={new Date()}
          className='h-full'
          isCompact={!isScrollTop}
        />
      </div>
    </header>
  );
});
