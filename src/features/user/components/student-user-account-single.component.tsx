import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { StudentUserAccount } from '../models/user.model';

type Props = ComponentProps<typeof BaseSurface> & {
  userAccount: StudentUserAccount;
};

export const StudentUserAccountSingle = memo(function ({
  className,
  userAccount,
  ...moreProps
}: Props) {
  const aboutMe = useMemo(() => userAccount.aboutMe, [userAccount]);

  return (
    <BaseSurface
      className={cx('flex flex-col gap-4', className)}
      rounded='sm'
      {...moreProps}
    >
      <div>
        <h3 className='mb-2.5 text-base'>About Me</h3>
        <p className={cx(!aboutMe && 'pl-2')}>{aboutMe || '—'}</p>
      </div>
    </BaseSurface>
  );
});
