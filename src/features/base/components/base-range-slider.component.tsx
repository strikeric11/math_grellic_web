import { memo, forwardRef } from 'react';
import { useController } from 'react-hook-form';
import cx from 'classix';

import { BaseIconButton } from './base-icon-button.component';
import { BaseTooltip } from './base-tooltip.component';

import type { ComponentProps, ReactNode } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import type { Placement } from '@floating-ui/react';

type Props = ComponentProps<'input'> & {
  label?: string;
  description?: string;
  errorMessage?: string;
  fullWidth?: boolean;
  asterisk?: boolean;
  wrapperProps?: ComponentProps<'div'>;
  leftIconButtonProps?: ComponentProps<typeof BaseIconButton> & {
    tooltip?: ReactNode;
    tooltipPlacement?: Placement;
  };
  rightIconButtonProps?: ComponentProps<typeof BaseIconButton> & {
    tooltip?: ReactNode;
    tooltipPlacement?: Placement;
  };
};

type ControlledProps = Props & UseControllerProps<any>;

export const BaseRangeSlider = memo(
  forwardRef<HTMLInputElement, Props>(function (
    {
      className,
      id,
      name,
      label,
      description,
      errorMessage,
      fullWidth,
      asterisk,
      required,
      disabled,
      wrapperProps: { className: wrapperClassName, ...moreWrapperProps } = {},
      leftIconButtonProps: {
        className: leftIconBtnClassName,
        name: leftIconBtnName = 'minus',
        tooltip: leftTooltip,
        tooltipPlacement: leftTooltipPlacement,
        ...moreLeftIconBtnProps
      } = {},
      rightIconButtonProps: {
        className: rightIconBtnClassName,
        name: rightIconBtnName = 'plus',
        tooltip: rightTooltip,
        tooltipPlacement: rightTooltipPlacement,
        ...moreRightIconBtnProps
      } = {},
      ...moreProps
    },
    ref,
  ) {
    const newId = id || name;

    return (
      <div
        className={cx('w-full', !fullWidth && 'max-w-input', wrapperClassName)}
        {...moreWrapperProps}
      >
        {!!label && (
          <label
            htmlFor={newId}
            className={cx(
              'relative font-medium text-accent/70 ',
              !!errorMessage && '!text-red-500',
              (asterisk || required) &&
                "after:absolute after:top-0.5 after:pl-1.5 after:text-xl after:text-yellow-500 after:content-['*']",
            )}
          >
            {label}
          </label>
        )}
        <div className='flex w-full items-center gap-2.5'>
          <BaseTooltip content={leftTooltip} placement={leftTooltipPlacement}>
            <BaseIconButton
              className={cx('basis-12', leftIconBtnClassName)}
              name={leftIconBtnName}
              variant='solid'
              size='xs'
              {...moreLeftIconBtnProps}
            />
          </BaseTooltip>
          <input
            ref={ref}
            name={name}
            type='range'
            id={newId}
            className={cx(
              'h-2 w-full cursor-pointer appearance-none rounded-lg border border-primary/40 bg-primary-focus-light/20 accent-primary',
              !!errorMessage && '!border-red-500/60',
              className,
              disabled && '!bg-backdrop-gray',
            )}
            required={required}
            disabled={disabled}
            {...moreProps}
          />
          <BaseTooltip content={rightTooltip} placement={rightTooltipPlacement}>
            <BaseIconButton
              className={cx('basis-12', rightIconBtnClassName)}
              name={rightIconBtnName}
              variant='solid'
              size='xs'
              {...moreRightIconBtnProps}
            />
          </BaseTooltip>
        </div>
        {!!description && !errorMessage && (
          <small className='mt-0.5 inline-block px-1 text-accent/80'>
            {description}
          </small>
        )}
        {!!errorMessage && (
          <small className='mt-0.5 inline-block px-1 text-red-500'>
            {errorMessage}
          </small>
        )}
      </div>
    );
  }),
);

export function BaseControlledRangeSlider(props: ControlledProps) {
  const {
    field: { value, ...moreFields },
    fieldState: { error },
  } = useController(props);

  return (
    <BaseRangeSlider
      {...props}
      {...moreFields}
      value={value || ''}
      errorMessage={error?.message}
    />
  );
}
