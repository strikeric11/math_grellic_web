import { memo } from 'react';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';

type Props = ComponentProps<'div'> & {
  iconName?: IconName;
  iconProps?: Omit<typeof BaseIcon, 'name'>;
};

export const BaseChip = memo(function ({
  className,
  iconName,
  iconProps,
  children,
  ...moreProps
}: Props) {
  return (
    <div className={cx(className, 'flex items-center gap-1')} {...moreProps}>
      {iconName && <BaseIcon name={iconName} size={20} {...iconProps} />}
      <span className='uppercase'>{children}</span>
    </div>
  );
});
