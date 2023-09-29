import { memo, forwardRef } from 'react';
import { useController } from 'react-hook-form';
import cx from 'classix';

import type { ComponentProps } from 'react';
import type { UseControllerProps } from 'react-hook-form';

type Props = ComponentProps<'textarea'> & {
  label?: string;
  description?: string;
  errorMessage?: string;
  fullWidth?: boolean;
  wrapperProps?: ComponentProps<'div'>;
};

type ControlledProps = Props & UseControllerProps<any>;

export const BaseTextArea = memo(
  forwardRef<HTMLTextAreaElement, Props>(function (
    {
      className,
      id,
      name,
      value,
      placeholder = '',
      description,
      errorMessage,
      fullWidth,
      required,
      disabled,
      wrapperProps: { className: wrapperClassName, ...moreWrapperProps } = {},
      ...moreProps
    },
    ref,
  ) {
    const newId = id || name;

    return (
      <div
        className={cx(
          'base-input flex w-full flex-col gap-y-0.5',
          !fullWidth && 'max-w-input',
          wrapperClassName,
        )}
        {...moreWrapperProps}
      >
        <textarea
          ref={ref}
          name={name}
          id={newId}
          className={cx(
            `peer relative h-input min-h-[60px] w-full rounded-md border-2 border-accent/40 py-4 pl-18px pr-5 text-accent !outline-none
              transition-[border,outline] focus:!border-primary-focus focus:!ring-1 focus:!ring-primary-focus group-disabled/field:!bg-backdrop-gray`,
            !!errorMessage && '!border-red-500/60',
            className,
            disabled && '!bg-backdrop-gray',
          )}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          {...moreProps}
        />
        {!!description && !errorMessage && (
          <small className='inline-block px-1 text-accent/80'>
            {description}
          </small>
        )}
        {!!errorMessage && (
          <small className='inline-block px-1 text-red-500'>
            {errorMessage}
          </small>
        )}
      </div>
    );
  }),
);

export function BaseControlledTextArea(props: ControlledProps) {
  const {
    field: { value, ...moreFields },
    fieldState: { error },
  } = useController(props);

  return (
    <BaseTextArea
      {...props}
      {...moreFields}
      value={value || ''}
      errorMessage={error?.message}
    />
  );
}
