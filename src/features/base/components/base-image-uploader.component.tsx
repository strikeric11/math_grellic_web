import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { useController } from 'react-hook-form';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';
import { BaseDivider } from './base-divider.component';

import type { ComponentProps, MouseEvent } from 'react';
import type { UseControllerProps } from 'react-hook-form';

type Props = ComponentProps<'input'> & {
  label?: string;
  description?: string;
  errorMessage?: string;
  fullWidth?: boolean;
  wrapperProps?: ComponentProps<'div'>;
  onRemove?: () => void;
};

type ControlledProps = Props & UseControllerProps<any>;

export const BaseImageUploader = memo(
  forwardRef<HTMLInputElement, Props>(function (
    {
      className,
      id,
      name,
      value,
      description,
      errorMessage,
      fullWidth,
      disabled,
      onRemove,
      wrapperProps: {
        className: wrapperClassName,
        onClick: wrapperOnClick,
        ...moreWrapperProps
      } = {},
      ...moreProps
    },
    ref,
  ) {
    const innerRef = useRef<HTMLInputElement>(null);
    const newId = id || name;

    const handleWrapperClick = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        innerRef.current?.click();
        wrapperOnClick && wrapperOnClick(event);
      },
      [wrapperOnClick],
    );

    const handleRemove = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        onRemove && onRemove();
      },
      [onRemove],
    );

    useImperativeHandle(ref, () => innerRef.current!, []);

    return (
      <div
        className={cx(
          'relative flex w-full cursor-pointer overflow-hidden rounded-md',
          'border-2 border-dashed transition-all hover:border-primary-focus',
          !value?.toString().trim().length
            ? 'min-h-[100px] items-center justify-center hover:bg-primary-focus-light/10'
            : 'items-start justify-start',
          !fullWidth && 'max-w-input',
          !errorMessage ? 'border-accent/50' : 'border-red-500',
          wrapperClassName,
        )}
        onClick={handleWrapperClick}
        {...moreWrapperProps}
      >
        {typeof value === 'string' && value?.trim() ? (
          <div className='group/remove h-full w-full' onClick={handleRemove}>
            <div className='absolute z-10 flex h-full w-full items-center justify-center transition-colors group-hover/remove:bg-white/80'>
              <BaseIcon
                name='x-circle'
                size={40}
                className='fill-red-500 opacity-0 transition-opacity group-hover/remove:opacity-100'
              />
            </div>
            <img src={value} />
          </div>
        ) : (
          <div>
            <div className='flex h-16 max-w-[250px] items-start gap-1'>
              <BaseIcon
                name='image-square'
                size={60}
                weight='thin'
                className='opacity-80'
              />
              <BaseDivider className='mr-1.5' vertical />
              <div className='flex w-28 flex-col py-2.5'>
                <small className='inline-block leading-tight text-accent/80'>
                  {description || 'Tap here to browse an image.'}
                </small>
                {!!errorMessage && (
                  <small className='inline-block text-red-500'>
                    {errorMessage}
                  </small>
                )}
              </div>
            </div>
          </div>
        )}
        <input
          className={cx(
            'absolute left-0 top-0 hidden h-0 w-0 overflow-hidden',
            className,
          )}
          ref={innerRef}
          name={name}
          type='file'
          id={newId}
          disabled={disabled}
          accept='image/*'
          value=''
          {...moreProps}
        />
      </div>
    );
  }),
);

export function BaseControlledImageUploader(props: ControlledProps) {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    field: { value, onChange, ...moreFields },
    fieldState: { error },
  } = useController(props);

  return (
    <BaseImageUploader
      {...props}
      {...moreFields}
      value={value || ''}
      errorMessage={error?.message}
    />
  );
}
