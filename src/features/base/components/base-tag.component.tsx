import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

export const BaseTag = memo(function ({
  className,
  children,
  ...moreProps
}: ComponentProps<'div'>) {
  return (
    <div
      className={cx(
        'rounded bg-accent/80 px-4 py-1 text-center text-xs font-medium uppercase tracking-wide text-white',
        className,
      )}
      {...moreProps}
    >
      {children}
    </div>
  );
});
