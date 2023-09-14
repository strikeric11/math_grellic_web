import { memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';
import type { SpinnerColor, SpinnerSize } from '../models/base.model';

type Props = ComponentProps<'div'> & {
  color?: SpinnerColor;
  size?: SpinnerSize;
};

export const BaseSpinner = memo(function ({
  color = 'primary',
  size = 'base',
  className,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'inline-block animate-spin rounded-full border-current',
        color === 'primary' && 'border-t-primary-focus text-primary/50',
        color === 'white' && 'border-t-white text-white/50',
        size === 'base' && 'h-16 w-16 border-[6px]',
        size === 'sm' && 'h-8 w-8 border-[4px]',
        size === 'xs' && 'h-6 w-6 border-[3px]',
        className,
      )}
      role='status'
      aria-label='loading'
      {...moreProps}
    >
      <span className='sr-only'>Loading...</span>
    </div>
  );
});

export const BasePageSpinner = memo(function ({
  className,
  absolute,
  ...moreProps
}: ComponentProps<'div'> & { absolute?: boolean }) {
  return (
    <div
      className={cx(
        'flex min-h-screen w-full animate-fadeIn items-center justify-center',
        absolute && 'absolute left-0 top-0',
        className,
      )}
      {...moreProps}
    >
      <BaseSpinner />
    </div>
  );
});
