import { memo } from 'react';
import cx from 'classix';

import { BaseLink } from '#/base/components/base-link.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  to?: string;
  linkLabel?: string;
};

export const CorePageNotFound = memo(function ({
  className,
  to = '/',
  linkLabel = 'Return to dashboard',
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'flex h-full w-full flex-1 animate-fadeIn flex-col items-center justify-center pb-8',
        className,
      )}
      {...moreProps}
    >
      <span className='mb-4 font-display text-3xl font-medium tracking-tighter text-primary'>
        Page Not Found
      </span>
      <span className='text-lg'>
        The page you are looking for does not exist.
      </span>
      <BaseLink to={to} className='!text-base'>
        {linkLabel}
      </BaseLink>
    </div>
  );
});
