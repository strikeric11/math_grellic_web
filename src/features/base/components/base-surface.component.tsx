import { forwardRef } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  rounded?: 'lg' | 'base' | 'sm' | 'xs' | 'none';
};

export const BaseSurface = forwardRef<HTMLDivElement, Props>(function (
  { className, rounded = 'base', children, ...moreProps },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(
        'rounded-2xl border border-primary-border-light bg-white p-5',
        rounded === 'xs' && '!rounded-md',
        rounded === 'sm' && '!rounded-lg',
        rounded === 'lg' && '!rounded-20px',
        rounded === 'none' && '!rounded-none',
        className,
      )}
      {...moreProps}
    >
      {children}
    </div>
  );
});
