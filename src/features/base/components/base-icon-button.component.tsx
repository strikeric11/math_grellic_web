import { forwardRef, memo } from 'react';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ComponentProps } from 'react';
import type {
  ButtonSize,
  ButtonVariant,
  IconName,
} from '#/base/models/base.model';

type Props = ComponentProps<'button'> & {
  name: IconName;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  isInput?: boolean;
  iconProps?: Omit<ComponentProps<typeof BaseIcon>, 'name'>;
};

export const BaseIconButton = memo(
  forwardRef<HTMLButtonElement, Props>(function (
    {
      className,
      name,
      variant = 'primary',
      size = 'base',
      // loading, TODO loading
      isInput,
      disabled,
      iconProps,
      ...moreProps
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type='button'
        className={cx(
          'inline-flex h-12 w-12 items-center justify-center rounded-md !outline-none transition-all active:scale-90',
          variant === 'primary' &&
            'border-2 border-primary-border bg-primary text-white drop-shadow-primary hover:bg-primary-focus',
          variant === 'solid' &&
            'border border-primary-border-light bg-white text-primary-focus hover:border-primary-focus-light hover:text-primary-focus-light',
          variant === 'link' &&
            '!rounded border border-transparent text-primary hover:text-primary-focus-light',
          variant === 'border' &&
            'border-2 border-primary text-primary hover:border-primary-focus-light hover:text-primary-focus-light',
          size === 'sm' && '!h-10 !w-10',
          size === 'xs' && '!h-9 !w-9',
          isInput &&
            '!h-auto !w-auto p-2.5 !text-accent hover:!text-primary-focus',
          disabled && '!pointer-events-none',
          className,
        )}
        disabled={disabled}
        {...moreProps}
      >
        <BaseIcon
          size={size === 'base' ? 28 : 22}
          weight='regular'
          name={name}
          {...iconProps}
        />
      </button>
    );
  }),
);
