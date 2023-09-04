import { memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import cx from 'classix';

import { ABSOLUTE_REGISTER_PATH } from '#/utils/path.util';
import { BaseButton } from '#/base/components/base-button.components';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { CoreStaticNavItem } from './core-static-nav-item.component';

import type { ComponentProps } from 'react';
import type { NavItem } from '#/base/models/base.model';

type Props = ComponentProps<'nav'> & {
  items: NavItem[];
  loading?: boolean;
  onGetStarted?: () => void;
  onLogin?: () => void;
};

export const CoreStaticNav = memo(function ({
  items,
  loading,
  onGetStarted,
  onLogin,
  ...moreProps
}: Props) {
  const { pathname } = useLocation();
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
    <nav {...moreProps}>
      <ul className='flex items-center'>
        {items.map(({ name, label, to }) => (
          <li key={name}>
            <CoreStaticNavItem to={to} label={label} />
          </li>
        ))}
        <li>
          <BaseButton
            className={cx(
              '!px-3.5 !font-body !font-medium !tracking-normal',
              pathname === ABSOLUTE_REGISTER_PATH &&
                '!text-primary-focus-light',
            )}
            variant='link'
            onClick={onGetStarted}
            loading={loading}
            disabled={user === undefined}
          >
            {getStartedText}
          </BaseButton>
        </li>
        <li className='pl-3.5'>
          <BaseButton
            className='!w-[150px] !px-4'
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
    </nav>
  );
});
