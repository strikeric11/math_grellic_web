import { forwardRef, memo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ComponentProps } from 'react';
import type { ButtonVariant, IconName } from '../models/base.model';

type Variant = Omit<ButtonVariant, 'primary' | 'border'>;

type Props = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: 'base' | 'sm';
  leftIconName?: IconName;
  rightIconName?: IconName;
  bodyFont?: boolean;
};

export const BaseLink = memo(
  forwardRef<HTMLAnchorElement, Props>(function (
    {
      className,
      variant = 'link',
      size = 'base',
      leftIconName,
      rightIconName,
      bodyFont,
      children,
      ...moreProps
    },
    ref,
  ) {
    const iconSize = size === 'sm' ? 24 : 30;

    return (
      <Link
        ref={ref}
        className={cx(
          'inline-flex items-center justify-center gap-2 py-0.5 font-display text-lg tracking-tighter text-primary transition-colors hover:text-primary-focus-light',
          variant === 'solid' &&
            'solid h-[46px] rounded-md border border-primary-border-light bg-white px-5 hover:!border-primary-focus-light',
          size === 'sm' && '!text-base',
          bodyFont && '!font-body !tracking-normal',
          className,
        )}
        {...moreProps}
      >
        {leftIconName && (
          <BaseIcon size={iconSize} weight='regular' name={leftIconName} />
        )}
        {children}
        {rightIconName && (
          <BaseIcon size={iconSize} weight='regular' name={rightIconName} />
        )}
      </Link>
    );
  }),
);
