import { memo } from 'react';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ComponentProps } from 'react';
import type { IconName } from '../models/base.model';

type Props = ComponentProps<'div'> & {
  iconName?: IconName;
  iconProps?: Omit<ComponentProps<typeof BaseIcon>, 'name'>;
  isIconEnd?: boolean;
};

export const BaseChip = memo(function ({
  className,
  iconName,
  iconProps,
  isIconEnd,
  children,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(className, 'flex items-center gap-1 uppercase')}
      {...moreProps}
    >
      {isIconEnd ? (
        <>
          <span>{children}</span>
          {iconName && <BaseIcon name={iconName} size={20} {...iconProps} />}
        </>
      ) : (
        <>
          {iconName && <BaseIcon name={iconName} size={20} {...iconProps} />}
          <span>{children}</span>
        </>
      )}
    </div>
  );
});
