import { memo } from 'react';
import cx from 'classix';

import { BaseLink } from '#/base/components/base-link.component';
import { BaseIcon } from '#/base/components/base-icon.component';

import type { ComponentProps } from 'react';
import type { GroupLink } from '#/base/models/base.model';

type Props = ComponentProps<'div'> & {
  links: Omit<GroupLink, 'label'>[];
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

export const DashboardShortcutMenu = memo(function ({
  className,
  links,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx('flex items-center justify-center gap-2.5', className)}
      {...moreProps}
    >
      {links.map(({ to, icons }) => (
        <BaseLink key={to} to={to} className='button !px-2.5' variant='solid'>
          <Icon icons={icons} />
        </BaseLink>
      ))}
    </div>
  );
});
