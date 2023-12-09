import { memo, forwardRef, useMemo } from 'react';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ComponentProps } from 'react';
import type { IconName } from '../models/base.model';

type Props = ComponentProps<'button'> & {
  size?: 'base' | 'sm';
  selected?: boolean;
  checked?: boolean;
  alwaysShowCheck?: boolean;
  center?: boolean;
  iconName?: IconName;
};

export const BaseDropdownButton = memo(
  forwardRef<HTMLButtonElement, Props>(function (
    {
      className,
      size = 'base',
      iconName,
      selected,
      checked,
      alwaysShowCheck,
      center,
      children,
      ...moreProps
    },
    ref,
  ) {
    const disabled = useMemo(
      () => moreProps.disabled || (moreProps as any)['aria-disabled'],
      [moreProps],
    );

    return (
      <button
        ref={ref}
        type='button'
        className={cx(
          'flex w-full flex-col rounded px-3 py-2.5 text-left leading-none',
          size === 'base' ? 'text-base' : 'text-sm',
          !disabled
            ? 'hover:bg-primary hover:text-white'
            : '!pointer-events-none text-accent/50',
          selected && '!bg-primary !text-white',
          className,
        )}
        disabled={disabled}
        {...moreProps}
      >
        <div
          className={cx(
            'relative flex h-4 w-full items-center',
            center ? 'justify-center' : 'justify-between',
          )}
        >
          <div className='flex h-full items-center gap-2'>
            {!!iconName && (
              <BaseIcon name={iconName} size={size === 'base' ? 18 : 20} />
            )}
            {children}
          </div>
          {alwaysShowCheck ? (
            <BaseIcon
              name='check-fat'
              className={cx(checked ? 'text-green-500' : 'text-accent/50')}
              size={size === 'base' ? 18 : 20}
              weight='fill'
            />
          ) : (
            checked && (
              <BaseIcon
                name='check-fat'
                className='text-green-500'
                size={size === 'base' ? 18 : 20}
                weight='fill'
              />
            )
          )}
        </div>
      </button>
    );
  }),
);
