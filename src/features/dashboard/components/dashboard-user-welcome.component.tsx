import { memo, useMemo } from 'react';
import cx from 'classix';

import { UserGender } from '#/user/models/user.model';
import { UserAvatarImg } from '#/user/components/user-avatar-img.component';

import type { ComponentProps } from 'react';
import type { User } from '#/user/models/user.model';

type Props = ComponentProps<'div'> & {
  user: User;
};

export const DashboardUserWelcome = memo(function ({
  className,
  user,
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
      className={cx('flex items-start justify-between', className)}
      {...moreProps}
    >
      <div className='flex items-center gap-3'>
        <UserAvatarImg gender={gender} size='base' />
        <h2 className='flex flex-col text-2xl leading-tight'>
          <span>Hello,</span>
          <span>{firstName}</span>
        </h2>
      </div>
      <span className='rounded-4px inline-block overflow-hidden border border-accent/50 px-2 py-1.5 text-sm leading-none text-accent/80'>
        {publicId}
      </span>
    </div>
  );
});
