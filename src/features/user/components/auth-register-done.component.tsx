import { ComponentProps, memo } from 'react';
import cx from 'classix';

import { BaseLink } from '#/base/components/base-link.component';

export const AuthRegisterDone = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'div'>) {
  return (
    <div className={cx('w-full p-1.5', className)} {...moreProps}>
      <div className='w-full px-4 pt-8 lg:px-11'>
        <h1 className='mb-2'>Sign up complete!</h1>
        <p className='mb-8 text-lg'>
          Your account is currently pending approval.
          <br />A notification will be sent once it&apos;s been approved.
        </p>
        <BaseLink to='/' rightIconName='arrow-circle-right'>
          Return to Home
        </BaseLink>
      </div>
    </div>
  );
});
