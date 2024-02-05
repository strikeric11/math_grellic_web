import { forwardRef, memo } from 'react';
import { useController } from 'react-hook-form';
import cx from 'classix';

import type { ComponentProps } from 'react';
import type { UseControllerProps } from 'react-hook-form';

type Props = ComponentProps<'input'> & {
  label?: string;
  labelClassName?: string;
  errorMessage?: string;
};

export const BaseCheckbox = memo(
  forwardRef<HTMLInputElement, Props>(function (
    {
      id,
      value,
      className,
      labelClassName,
      name,
      label,
      errorMessage,
      disabled,
      ...moreProps
    },
    ref,
  ) {
    const newId = id || name;

    return (
      <div className='flex items-center'>
        <input
          ref={ref}
          name={name}
          type='checkbox'
          id={newId}
          checked={!!value}
          className={cx(
            'mt-0.5 shrink-0 cursor-pointer rounded border-2 border-accent/40 text-primary',
            disabled && '!bg-backdrop-gray',
            className,
          )}
          disabled={disabled}
          {...moreProps}
        />
        {!!label && (
          <label
            htmlFor={newId}
            className={cx(
              'ml-3 cursor-pointer text-sm !leading-tight',
              !!errorMessage && 'text-red-500',
              labelClassName,
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }),
);

export function BaseControlledCheckbox(props: Props & UseControllerProps<any>) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return <BaseCheckbox {...props} {...field} errorMessage={error?.message} />;
}
