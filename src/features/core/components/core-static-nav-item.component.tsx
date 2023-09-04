import { memo, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classix';

import type { ComponentProps } from 'react';
import type { NavItem } from '#/base/models/base.model';

type Props = Omit<ComponentProps<typeof NavLink>, 'className'> &
  Omit<NavItem, 'to' | 'name'> & {
    className?: string;
  };

export const CoreStaticNavItem = memo(function ({
  className,
  to,
  label,
  ...moreProps
}: Props) {
  const setClassName = useCallback(
    ({ isActive }: { isActive: boolean }) =>
      cx(
        'inline-block px-3.5 py-0.5 text-lg font-medium text-primary transition-colors hover:text-primary-focus-light',
        isActive && '!text-primary-focus-light',
        className,
      ),
    [className],
  );

  return (
    <NavLink className={setClassName} to={to} {...moreProps}>
      {label}
    </NavLink>
  );
});
