import cx from 'classix';

import gridPng from '#/assets/images/grid.png';

import type { ComponentProps } from 'react';

const bgStyle = { backgroundImage: `url(${gridPng})` };

export function CoreStaticMain({
  className,
  children,
  ...moreProps
}: ComponentProps<'main'>) {
  return (
    <main className={cx('relative min-h-[850px]', className)} {...moreProps}>
      <div
        style={bgStyle}
        className='absolute top-0 flex h-[861px] w-full items-end bg-backdrop-focus'
      >
        <div className='h-[681px] w-full bg-gradient-to-t from-backdrop to-transparent' />
      </div>
      <div className='relative z-10'>{children}</div>
    </main>
  );
}
