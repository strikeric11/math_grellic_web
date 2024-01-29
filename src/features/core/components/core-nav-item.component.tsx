import { memo, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classix';

import { NavItem } from '#/base/models/base.model';
import { BaseIcon } from '#/base/components/base-icon.component';

import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof NavLink>, 'className'> &
  Omit<NavItem, 'to' | 'name'> & {
    className?: string;
    isExpanded?: boolean;
    isMobile?: boolean;
  };

export const CoreNavItem = memo(function ({
  className,
  to,
  label,
  iconName,
  size,
  isExpanded,
  isMobile,
  ...moreProps
}: Props) {
  const setClassName = useCallback(
    ({ isActive }: { isActive: boolean }) =>
      cx(
        'relative flex h-12 items-center gap-5 px-4 font-body text-lg font-medium text-primary transition-colors hover:text-primary-focus-light',
        isActive && '!text-primary-focus-light',
        className,
      ),
    [className],
  );

  return (
    <NavLink className={setClassName} to={to} {...moreProps}>
      {({ isActive }) => (
        <>
          <div className='flex w-9 shrink-0 items-center justify-center'>
            {!!iconName && <BaseIcon name={iconName} size={size || 32} />}
          </div>
          <span
            className={cx(
              'opacity-0 transition-opacity duration-300',
              (isMobile || isExpanded) && '!opacity-100',
            )}
          >
            {label}
          </span>
          <div
            className={cx(
              'absolute -right-[1px] top-1/2 h-0 w-0 -translate-y-1/2 translate-x-4 border-b-[11px] border-r-[15px] border-t-[11px] border-solid border-transparent border-r-primary transition-transform',
              isActive && '!translate-x-0',
              isMobile && '!hidden',
            )}
          >
            <div className='absolute -top-2.5 left-0.5 h-0 w-0 border-b-[10px] border-r-[14px] border-t-[10px] border-solid border-transparent border-r-backdrop' />
          </div>
        </>
      )}
    </NavLink>
  );
});
