import { forwardRef, memo } from 'react';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ComponentProps } from 'react';
import type { IconWeight } from '@phosphor-icons/react';
import type { IconName } from '../models/base.model';

type Props = ComponentProps<'button'> & {
  leftIconName?: IconName;
  rightIconName?: IconName;
  disabled?: boolean;
};

const iconProps = {
  size: 15,
  weight: 'bold' as IconWeight,
  className: 'mt-[1px]',
};

export const BaseControlButton = memo(
  forwardRef<HTMLButtonElement, Props>(function (
    {
      className,
      leftIconName,
      rightIconName,
      disabled,
      children,
      ...moreProps
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type='button'
        className={cx(
          `inline-flex items-center justify-center gap-2 px-2 py-1 text-sm font-medium uppercase
          leading-none tracking-widest text-primary !outline-none transition-colors hover:text-primary-focus-light`,
          disabled && '!pointer-events-none bg-gray-300 !text-accent/50',
          className,
        )}
        disabled={disabled}
        {...moreProps}
      >
        {leftIconName && <BaseIcon name={leftIconName} {...iconProps} />}
        {children}
        {rightIconName && <BaseIcon name={rightIconName} {...iconProps} />}
      </button>
    );
  }),
);
