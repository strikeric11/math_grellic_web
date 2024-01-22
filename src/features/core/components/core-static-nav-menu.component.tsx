import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.components';
import { useBoundStore } from '../hooks/use-store.hook';
import { CoreStaticNavItem } from './core-static-nav-item.component';

import type { ComponentProps } from 'react';
import type { NavItem } from '#/base/models/base.model';

type Props = ComponentProps<'ul'> & {
  items: NavItem[];
  loading?: boolean;
  isRegisterPath?: boolean;
  onGetStarted?: () => void;
  onLogin?: () => void;
};

export const CoreStaticNavMenu = memo(function ({
  className,
  items,
  loading,
  isRegisterPath,
  onGetStarted,
  onLogin,
  ...moreProps
}: Props) {
  const user = useBoundStore((state) => state.user);

  const getStartedText = useMemo(
    () => (!user ? 'Get Started' : 'Logout'),
    [user],
  );

  const loginText = useMemo(() => (!user ? 'Sign In' : 'Dashboard'), [user]);

  const loginRightIconName = useMemo(
    () => (!user ? 'door-open' : 'rocket-launch'),
    [user],
  );

  return (
    <ul
      className={cx(
        'flex flex-col items-center gap-2.5 lg:flex-row lg:gap-0',
        className,
      )}
      {...moreProps}
    >
      {items.map(({ name, label, to }) => (
        <li key={name} className='w-full text-center lg:w-auto'>
          <CoreStaticNavItem to={`/${to}`} label={label} />
        </li>
      ))}
      <li className='w-full text-center lg:w-auto'>
        <BaseButton
          className={cx(
            '!px-3.5 !font-body !font-medium !tracking-normal',
            isRegisterPath && '!text-primary-focus-light',
          )}
          variant='link'
          onClick={onGetStarted}
          loading={loading}
          disabled={user === undefined}
        >
          {getStartedText}
        </BaseButton>
      </li>
      <li className='w-full lg:w-auto lg:pl-3.5'>
        <BaseButton
          className='!w-full !px-4 lg:!w-[150px]'
          rightIconName={loginRightIconName}
          size='sm'
          onClick={onLogin}
          loading={user === undefined}
          disabled={loading}
        >
          {loginText}
        </BaseButton>
      </li>
    </ul>
  );
});
