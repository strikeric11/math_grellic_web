import { memo } from 'react';
import cx from 'classix';

import { CoreNavItem } from './core-nav-item.component';

import type { ComponentProps } from 'react';
import type { NavItem } from '#/base/models/base.model';

type Props = ComponentProps<'nav'> & {
  links: NavItem[];
  isExpanded?: boolean;
};

export const CoreNav = memo(function ({
  className,
  links,
  isExpanded,
  ...moreProps
}: Props) {
  return (
    <nav
      className={cx('flex w-full items-center overflow-hidden', className)}
      {...moreProps}
    >
      <ul className='flex w-full flex-col'>
        {links.map(({ name, label, to, iconName, size, end }) => (
          <li key={name}>
            <CoreNavItem
              to={to}
              label={label}
              iconName={iconName}
              size={size}
              isExpanded={isExpanded}
              end={end}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
});
