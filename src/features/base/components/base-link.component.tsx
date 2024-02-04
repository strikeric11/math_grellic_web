import { forwardRef, memo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ComponentProps } from 'react';
import type { ButtonVariant, IconName } from '../models/base.model';
import type { IconWeight } from '@phosphor-icons/react';

type Variant = Omit<ButtonVariant, 'primary' | 'border'>;

type Props = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: 'base' | 'sm' | 'xs';
  leftIconName?: IconName;
  rightIconName?: IconName;
  bodyFont?: boolean;
  iconWeight?: IconWeight;
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
      iconWeight = 'regular',
      children,
      ...moreProps
    },
    ref,
  ) {
    const iconSize = size === 'base' ? 30 : 24;

    return (
      <Link
        ref={ref}
        className={cx(
          'inline-flex items-center justify-center gap-2 py-0.5 font-display text-lg !leading-none tracking-tighter text-primary transition-colors hover:text-primary-focus-light',
          variant === 'solid' &&
            'solid h-[46px] rounded-md border border-primary-border-light bg-white px-5 hover:!border-primary-focus-light',
          size === 'sm' && '!text-base',
          size === 'xs' && '!text-sm',
          bodyFont && '!font-body !tracking-normal',
          className,
        )}
        {...moreProps}
      >
        {leftIconName && (
          <BaseIcon size={iconSize} weight={iconWeight} name={leftIconName} />
        )}
        {children}
        {rightIconName && (
          <BaseIcon size={iconSize} weight={iconWeight} name={rightIconName} />
        )}
      </Link>
    );
  }),
);
