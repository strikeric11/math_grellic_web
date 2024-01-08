import { memo, useMemo } from 'react';
import isURL from 'validator/lib/isURL';
import cx from 'classix';

import { BaseLink } from '#/base/components/base-link.component';

import type { ComponentProps } from 'react';
import { BaseIcon } from '#/base/components/base-icon.component';

export const UserMessengerLink = memo(function ({
  className,
  children,
  to,
  ...moreProps
}: ComponentProps<typeof BaseLink>) {
  const isToValid = useMemo(() => isURL(to as string), [to]);

  return (
    <BaseLink
      className={cx(
        '!h-auto py-1.5 !text-white',
        isToValid ? '!bg-blue-500' : 'pointer-events-none !bg-accent/40',
        className,
      )}
      variant='solid'
      target='_blank'
      to={to}
      {...moreProps}
    >
      <BaseIcon name='messenger-logo' weight='fill' size={22} />
      {children || 'Send to Messenger'}
    </BaseLink>
  );
});
