import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { UserGender } from '#/user/models/user.model';
import { BaseIcon } from '#/base/components/base-icon.component';
import { UserAvatarImg } from '#/user/components/user-avatar-img.component';

import type { ComponentProps } from 'react';
import type { User } from '#/user/models/user.model';

type Props = ComponentProps<'div'> & {
  user: User;
  to: string;
};

export const DashboardUserWelcome = memo(function ({
  className,
  user,
  to,
  ...moreProps
}: Props) {
  const [publicId, firstName, gender] = useMemo(
    () => [
      user.publicId,
      user.userAccount?.firstName,
      user.userAccount?.gender || UserGender.Female,
    ],
    [user],
  );

  return (
    <div
      className={cx(
        'flex flex-col items-start justify-between gap-2.5 -2xs:flex-row',
        className,
      )}
      {...moreProps}
    >
      <div className='flex items-center gap-3'>
        <UserAvatarImg gender={gender} size='base' />
        <h2 className='flex flex-col text-2xl leading-tight transition-colors group-hover:text-primary-focus-light'>
          <span>Hello,</span>
          <span>{firstName}</span>
        </h2>
      </div>
      <Link
        to={to}
        className={cx(
          'flex items-center gap-1 overflow-hidden rounded-4px border border-accent/50 px-1.5 py-1',
          'text-sm leading-none transition-all hover:border-primary-focus hover:text-primary-focus',
        )}
      >
        <BaseIcon name='identification-badge' size={18} />
        <span>{publicId}</span>
      </Link>
    </div>
  );
});
