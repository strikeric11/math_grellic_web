import { memo, forwardRef, useState, useCallback, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';
import { BaseIconButton } from './base-icon-button.component';
import { BaseTooltip } from './base-tooltip.component';

import type { ComponentProps, FormEvent, ReactNode } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import type { Placement } from '@floating-ui/react';
import type { IconName } from '../models/base.model';

type Props = ComponentProps<'input'> & {
  label?: string;
  description?: string;
  errorMessage?: string;
  iconName?: IconName;
  leftContent?: ReactNode;
  fullWidth?: boolean;
  asterisk?: boolean;
  wrapperProps?: ComponentProps<'div'>;
  rightButtonProps?: ComponentProps<typeof BaseIconButton> & {
    tooltip?: ReactNode;
    tooltipPlacement?: Placement;
  };
};

type ControlledProps = Props & UseControllerProps<any>;

export const BaseInput = memo(
  forwardRef<HTMLInputElement, Props>(function (
    {
      className,
      id,
      name,
      value,
      placeholder = '',
      label,
      description,
      errorMessage,
      iconName,
      leftContent,
      fullWidth,
      asterisk,
      required,
      disabled,
      wrapperProps: { className: wrapperClassName, ...moreWrapperProps } = {},
      rightButtonProps: {
        className: rightIconBtnClassName,
        name: rightIconBtnName,
        tooltip,
        tooltipPlacement,
        ...moreRightIconBtnProps
      } = {},
      ...moreProps
    },
    ref,
  ) {
    const newId = id || name;

    return (
      <div
        className={cx(
          'base-input w-full',
          !fullWidth && 'max-w-input',
          wrapperClassName,
        )}
        {...moreWrapperProps}
      >
        <div className={cx('relative w-full', label ? 'h-input' : 'h-12')}>
          <input
            ref={ref}
            name={name}
            type='text'
            id={newId}
            className={cx(
              `peer h-full w-full rounded-md border-2 border-accent/40 pb-2 pl-18px pr-5 text-accent !outline-none
              transition-all focus:!border-primary-focus focus:!ring-1 focus:!ring-primary-focus group-disabled/field:!bg-backdrop-gray`,
              label ? 'pt-26px' : 'pt-2',
              (!!leftContent || !!iconName) && '!pl-43px',
              !!errorMessage && '!border-red-500/60',
              !!rightIconBtnName && '!pr-11',
              className,
              disabled && '!bg-backdrop-gray',
            )}
            value={value}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            {...moreProps}
          />
          {leftContent}
          {!!iconName && (
            <BaseIcon
              name={iconName}
              size={22}
              className={cx(
                'absolute left-15px top-1/2 -translate-y-1/2 peer-focus:!text-primary',
                !!errorMessage && '!text-red-500',
              )}
            />
          )}
          {!!label && (
            <label
              htmlFor={newId}
              className={cx(
                `absolute left-5 top-1/2 -translate-y-1/2 font-medium text-accent/70 transition-all peer-focus:-translate-y-111 peer-focus:text-13px
                peer-focus:!text-primary after:peer-focus:!top-0`,
                !!value && '!-translate-y-111 !text-13px after:!top-0',
                (!!leftContent || !!iconName) && '!left-45px',
                !!errorMessage && '!text-red-500',
                (asterisk || required) &&
                  "after:absolute after:top-0.5 after:pl-1.5 after:text-xl after:text-yellow-500 after:content-['*']",
              )}
            >
              {label}
            </label>
          )}
          {!!rightIconBtnName && (
            <BaseTooltip content={tooltip} placement={tooltipPlacement}>
              <BaseIconButton
                name={rightIconBtnName}
                variant='link'
                size='xs'
                className={cx(
                  'absolute right-1 top-1/2 -translate-y-1/2 !text-accent hover:!text-primary',
                  rightIconBtnClassName,
                )}
                disabled={disabled}
                {...moreRightIconBtnProps}
              />
            </BaseTooltip>
          )}
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

export function BaseControlledInput(props: ControlledProps) {
  const {
    field: { value, ...moreFields },
    fieldState: { error },
  } = useController(props);

  return (
    <BaseInput
      {...props}
      {...moreFields}
      value={value || ''}
      errorMessage={error?.message}
    />
  );
}

export function BaseControlledNumberInput(props: ControlledProps) {
  const {
    field: { value, onChange, ...moreFields },
    fieldState: { error },
  } = useController(props);

  const transformedValue = useMemo(() => {
    if (value == null) {
      return '';
    }
    return value.toString();
  }, [value]);

  const handleChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      if (event.currentTarget.value.trim() == '') {
        onChange('');
        return;
      }

      const output = isNaN(+event.currentTarget.value)
        ? event.currentTarget.value
        : +event.currentTarget.value;
      onChange(output);
    },
    [onChange],
  );

  return (
    <BaseInput
      {...props}
      {...moreFields}
      value={transformedValue}
      onChange={handleChange}
      errorMessage={error?.message}
    />
  );
}

export function BaseControlledPhoneInput(
  props: Props & UseControllerProps<any>,
) {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    field: { ref, onBlur, ...moreField },
    fieldState: { error },
  } = useController(props);

  const [isFocus, setIsFocus] = useState(false);

  const handleFocus = useCallback(() => setIsFocus(true), []);

  const handleBlur = useCallback(() => {
    onBlur();
    setIsFocus(false);
  }, [onBlur]);

  return (
    <PatternFormat
      {...props}
      {...moreField}
      type='text'
      customInput={BaseInput}
      errorMessage={error?.message}
      format='0###-###-####'
      mask='_'
      allowEmptyFormatting={isFocus}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}
