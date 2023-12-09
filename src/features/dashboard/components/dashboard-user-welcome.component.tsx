import { memo, useMemo } from 'react';
import cx from 'classix';

import { UserAvatarImg } from '#/user/components/user-avatar-img.component';

import type { ComponentProps } from 'react';
import type {
  StudentUserAccount,
  TeacherUserAccount,
} from '#/user/models/user.model';

type Props = ComponentProps<'div'> & {
  userAccount: TeacherUserAccount | StudentUserAccount;
};

export const DashboardUserWelcome = memo(function ({
  className,
  userAccount,
  ...moreProps
}: Props) {
  const { firstName, gender } = useMemo(() => userAccount, [userAccount]);

  return (
    <div className={cx('flex items-center gap-3', className)} {...moreProps}>
      <UserAvatarImg gender={gender} size='base' />
      <h2 className='flex flex-col text-2xl leading-tight'>
        <span>Hello,</span>
        <span>{firstName}</span>
      </h2>
    </div>
  );
});
