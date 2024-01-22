import { memo } from 'react';
import cx from 'classix';

import { BaseLink } from '#/base/components/base-link.component';

import type { ComponentProps } from 'react';

export const AuthRegisterDone = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'div'>) {
  return (
    <div className={cx('w-full p-1.5', className)} {...moreProps}>
      <div className='xs:block flex w-full flex-col items-center px-4 pt-8 lg:px-11'>
        <h1 className='xs:text-left mb-2 w-full text-center'>
          Sign up complete!
        </h1>
        <p className='xs:text-left mb-8 text-center text-lg'>
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
