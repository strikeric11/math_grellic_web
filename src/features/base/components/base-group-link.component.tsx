import { memo } from 'react';
import cx from 'classix';

import { BaseLink } from './base-link.component';
import { BaseIcon } from './base-icon.component';

import type { ComponentProps } from 'react';
import type { GroupLink } from '../models/base.model';

type Props = ComponentProps<'div'> & {
  links: GroupLink[];
  size?: ComponentProps<typeof BaseLink>['size'];
};

const DEFAULT_SIZE = 26;

const Icon = memo(function ({ icons }: { icons: GroupLink['icons'] }) {
  if (!icons) {
    return null;
  }

  if (icons.length <= 1) {
    return (
      <BaseIcon name={icons[0].name} size={icons[0].size || DEFAULT_SIZE} />
    );
  }

  return (
    <div className='flex items-center'>
      {icons.map(({ name, size }, index) => (
        <BaseIcon key={index} name={name} size={size || DEFAULT_SIZE} />
      ))}
    </div>
  );
});

export const BaseGroupLink = memo(function ({
  className,
  links,
  size = 'sm',
  ...moreProps
}: Props) {
  return (
    <div className={cx('group-button mobile-fw', className)} {...moreProps}>
      {links.map(({ to, label, icons }) => (
        <BaseLink
          key={to}
          to={to}
          className='button'
          variant='solid'
          size={size}
        >
          <Icon icons={icons} />
          {label}
        </BaseLink>
      ))}
    </div>
  );
});
