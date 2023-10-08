import { forwardRef, memo, useCallback, useMemo, useState } from 'react';
import { useController } from 'react-hook-form';
import { EditableMathField } from 'react-mathquill';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';
import { BaseIconButton } from './base-icon-button.component';
import { BaseTooltip } from './base-tooltip.component';

import type { ComponentProps, ReactNode } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import type { MathField } from 'react-mathquill';
import type { Placement } from '@floating-ui/react';
import type { IconName } from '../models/base.model';

type Props = ComponentProps<typeof EditableMathField> & {
  name?: string;
  value?: string;
  description?: string;
  errorMessage?: string;
  iconName?: IconName;
  leftContent?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  wrapperProps?: ComponentProps<'div'>;
  rightButtonProps?: ComponentProps<typeof BaseIconButton> & {
    tooltip?: ReactNode;
    tooltipPlacement?: Placement;
  };
  onChange?: (value: string) => void;
};

type ControlledProps = Props & UseControllerProps<any>;

export const BaseMathInput = memo(
  forwardRef<HTMLInputElement, Props>(function (
    {
      className,
      id,
      name,
      value,
      placeholder = '',
      description,
      errorMessage,
      iconName,
      leftContent,
      fullWidth,
      disabled,
      wrapperProps: { className: wrapperClassName, ...moreWrapperProps } = {},
      rightButtonProps: {
        className: rightIconBtnClassName,
        name: rightIconBtnName,
        tooltip,
        tooltipPlacement,
        ...moreRightIconBtnProps
      } = {},
      onChange,
      ...moreProps
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref,
  ) {
    const newId = id || name;
    const [latex, setLatex] = useState('');

    const targetValue = useMemo(() => value || latex, [value, latex]);

    const handleChange = useCallback(
      (mathField: MathField) => {
        setLatex(mathField.latex());
        onChange && onChange(mathField.latex());
      },
      [setLatex, onChange],
    );

    return (
      <div
        className={cx(
          'base-input w-full',
          !fullWidth && 'max-w-input',
          wrapperClassName,
        )}
        {...moreWrapperProps}
      >
        <div className='relative flex min-h-[46px] w-full flex-col'>
          <EditableMathField
            id={newId}
            className={cx(
              `mq-editable-field mq-math-mode peer h-full w-full flex-1 !rounded-md border-2 border-accent/40 pl-18px pr-5 pt-1 text-accent !outline-none
                transition-all group-disabled/field:!bg-backdrop-gray [&.mq-focused]:!border-primary-focus [&.mq-focused]:!ring-1 [&.mq-focused]:!ring-primary-focus`,
              (!!leftContent || !!iconName) && '!pl-43px',
              !!errorMessage && '!border-red-500/60',
              !!rightIconBtnName && '!pr-11',
              className,
              disabled && '!bg-backdrop-gray',
            )}
            placeholder={placeholder}
            latex={targetValue}
            onChange={handleChange}
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

export function BaseControlledMathInput(props: ControlledProps) {
  const {
    field: { value, ...moreFields },
    fieldState: { error },
  } = useController(props);

  return (
    <BaseMathInput
      {...props}
      {...moreFields}
      value={value || ''}
      errorMessage={error?.message}
    />
  );
}
