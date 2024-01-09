import { memo, useMemo } from 'react';
import isURL from 'validator/lib/isURL';
import cx from 'classix';

import { BaseLink } from '#/base/components/base-link.component';

import type { ComponentProps } from 'react';
import { BaseIcon } from '#/base/components/base-icon.component';

type Props = ComponentProps<typeof BaseLink> & {
  isLight?: boolean;
};

export const UserMessengerLink = memo(function ({
  className,
  children,
  to,
  isLight,
  ...moreProps
}: Props) {
  const linkClassName = useMemo(() => {
    if (!isURL(to as string)) {
      return '!pointer-events-none !bg-accent/40 !text-white';
    }

    return isLight ? '!bg-white !text-blue-400' : '!bg-blue-500 !text-white';
  }, [to, isLight]);

  return (
    <BaseLink
      className={cx('!h-auto py-1.5', linkClassName, className)}
      variant='solid'
      target='_blank'
      to={to}
      size='xs'
      {...moreProps}
    >
      <BaseIcon name='messenger-logo' weight='fill' size={22} />
      {children || 'Send to Messenger'}
    </BaseLink>
  );
});
