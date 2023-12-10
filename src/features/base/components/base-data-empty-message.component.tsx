import { memo } from 'react';
import cx from 'classix';

import { BaseDivider } from './base-divider.component';
import { BaseLink } from './base-link.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  message: string;
  linkTo: string;
  linkLabel?: string;
};

export const BaseDataEmptyMessage = memo(function ({
  className,
  message,
  linkTo,
  linkLabel = 'Create New',
  ...moreProps
}: Props) {
  return (
    <div
      className={cx('flex w-full items-center justify-center py-4', className)}
      {...moreProps}
    >
      <span>{message}</span>
      <BaseDivider className='!mx-2 !h-6' vertical />
      <BaseLink to={linkTo} size='sm' bodyFont>
        {linkLabel}
      </BaseLink>
    </div>
  );
});
