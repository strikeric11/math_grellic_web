import { forwardRef, memo } from 'react';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';
import { BaseSpinner } from './base-spinner.component';

import type { ComponentProps } from 'react';
import type { ButtonVariant, ButtonSize, IconName } from '../models/base.model';

type Props = ComponentProps<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIconName?: IconName;
  rightIconName?: IconName;
  bodyFont?: boolean;
  loading?: boolean;
};

type IconProps = ComponentProps<typeof BaseIcon> & {
  variant: ButtonVariant;
  size: ButtonSize;
  name: IconName;
};

const Icon = memo(function ({ variant, size, name, ...moreProps }: IconProps) {
  switch (variant) {
    case 'primary':
      return (
        <BaseIcon
          className='box-content px-2.5'
          size={24}
          weight='regular'
          {...moreProps}
          name={name}
        />
      );
    case 'link': {
      const iconSize = size === 'sm' || size === 'xs' ? 24 : 28;
      return (
        <BaseIcon size={iconSize} weight='regular' {...moreProps} name={name} />
      );
    }
    case 'border':
      return <BaseIcon size={22} weight='regular' {...moreProps} name={name} />;
    default:
      return <BaseIcon size={20} weight='bold' {...moreProps} name={name} />;
  }
});

export const BaseButton = memo(
  forwardRef<HTMLButtonElement, Props>(function (
    {
      className,
      variant = 'solid',
      size = 'base',
      leftIconName,
      rightIconName,
      bodyFont,
      loading,
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
          'button relative inline-flex w-fit items-center justify-center font-display tracking-tighter !outline-none transition-all active:scale-95',
          variant === 'primary' &&
            'group/btn h-[55px] !items-start text-lg text-white drop-shadow-primary-lg',
          (variant === 'solid' || variant === 'border') &&
            'h-12 rounded-md border-2 px-6 py-2',
          variant === 'solid' &&
            'border-primary-border bg-primary text-white drop-shadow-primary hover:bg-primary-focus',
          variant === 'solid' &&
            disabled &&
            '!border-accent/40 !bg-gray-300 !text-accent/50',
          variant === 'border' &&
            'border-primary text-primary !transition-transform hover:border-primary-focus-light hover:text-primary-focus-light',
          variant === 'border' &&
            disabled &&
            '!border-accent/40 !text-accent/50',
          variant === 'link' &&
            'py-0.5 text-lg text-primary !transition-transform hover:text-primary-focus-light',
          variant === 'link' && disabled && '!text-accent/50',
          (variant === 'solid' || variant === 'border') &&
            size === 'sm' &&
            '!h-10',
          (variant === 'solid' || variant === 'border') &&
            size === 'xs' &&
            '!h-9 !px-3 !text-sm !tracking-normal',
          variant === 'link' && (size === 'sm' || size === 'xs') && '!text-sm',
          bodyFont && '!font-body !tracking-normal',
          (loading || disabled) && '!pointer-events-none',
          className,
        )}
        disabled={disabled || loading}
        {...moreProps}
      >
        {loading && (
          <div className='absolute flex h-full w-full items-center justify-center'>
            <BaseSpinner
              color={
                variant === 'primary' || variant === 'solid'
                  ? 'white'
                  : 'primary'
              }
              size={size === 'base' ? 'sm' : 'xs'}
            />
          </div>
        )}
        <div
          className={cx(
            'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all',
            variant === 'primary' &&
              'relative z-10 h-[50px] rounded-full border-2 border-primary-border bg-gradient-to-r from-primary-focus to-primary-dark group-hover/btn:brightness-125 group-active/btn:translate-y-[5px]',
            variant === 'primary' &&
              disabled &&
              '!border-accent/40 !bg-gray-300 !bg-none',
            loading && '!opacity-30',
          )}
        >
          {leftIconName &&
            (variant === 'primary' ? (
              <div className='relative flex h-full items-center'>
                <div className='absolute right-0 top-0 h-full w-px scale-y-75 bg-backdrop opacity-30' />
                <Icon name={leftIconName} variant={variant} size={size} />
              </div>
            ) : (
              <Icon name={leftIconName} variant={variant} size={size} />
            ))}
          {variant === 'primary' ? (
            <div
              className={cx(
                'px-[28px]',
                rightIconName && '!pr-4',
                disabled && '!text-accent/50',
              )}
            >
              {children}
            </div>
          ) : (
            children
          )}
          {rightIconName &&
            (variant === 'primary' ? (
              <div className='relative flex h-full items-center'>
                <div className='absolute left-0 top-0 h-full w-px scale-y-75 bg-backdrop opacity-30' />
                <Icon name={rightIconName} variant={variant} size={size} />
              </div>
            ) : (
              <Icon name={rightIconName} variant={variant} size={size} />
            ))}
        </div>
        {variant === 'primary' && (
          <div
            className={cx(
              'absolute bottom-0 h-[50px] w-full rounded-full border-2 border-primary-border bg-black',
              disabled && '!border-accent/40 !bg-backdrop-gray',
            )}
          >
            <div
              className={cx(
                'h-full w-full rounded-full bg-gradient-to-r from-primary-focus to-primary-dark opacity-90 group-hover/btn:brightness-125',
                disabled && '!bg-gray-300 !bg-none',
              )}
            />
          </div>
        )}
      </button>
    );
  }),
);
