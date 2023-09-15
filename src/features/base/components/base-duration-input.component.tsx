import { memo, forwardRef, useState, useCallback, useEffect } from 'react';
import { PatternFormat } from 'react-number-format';
import { useController } from 'react-hook-form';
import cx from 'classix';

import { BaseInput } from './base-input.component';

import type { ComponentProps, FocusEvent } from 'react';
import type {
  NumberFormatValues,
  PatternFormatProps,
} from 'react-number-format';
import type { UseControllerProps } from 'react-hook-form';

type Props = Omit<
  PatternFormatProps<ComponentProps<typeof BaseInput>>,
  'format'
>;

type ControlledProps = Props & UseControllerProps<any>;

export const BaseDurationInput = memo(
  forwardRef<HTMLDivElement, Props>(function (
    { value, fullWidth, onChange, onBlur, ...moreProps },
    ref,
  ) {
    const [localValue, setLocalValue] = useState<
      NumberFormatValues | undefined
    >(undefined);
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
      const floatValue = value
        ? parseFloat(value.toString().replace(/[^0-9]/g, ''))
        : undefined;
      const formattedValue = value?.toString() || '';
      const val = value?.toString().replace(/[^0-9]/g, '') || '';
      setLocalValue({ floatValue, formattedValue, value: val });
    }, [value]);

    const handleFocus = useCallback(() => setIsFocus(true), []);

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        if (event.currentTarget.contains(event.relatedTarget)) {
          return;
        }

        !!onBlur && onBlur(event);
        setIsFocus(false);
      },
      [onBlur],
    );

    const handleChange = useCallback(
      (values?: NumberFormatValues) => {
        if (!onChange) {
          return;
        }

        onChange(
          values?.value.trim().length
            ? (values.formattedValue as any)
            : undefined,
        );
      },
      [onChange],
    );

    const handleValueChange = useCallback(
      (values: NumberFormatValues) => {
        setLocalValue(values);
        handleChange(values);
      },
      [handleChange],
    );

    return (
      <div
        ref={ref}
        className={cx('relative w-full', !fullWidth && 'max-w-input')}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <PatternFormat
          {...moreProps}
          value={localValue?.value}
          type='text'
          customInput={BaseInput}
          format='##:##:##'
          mask='_'
          allowEmptyFormatting={isFocus}
          fullWidth={fullWidth}
          onValueChange={handleValueChange}
        />
      </div>
    );
  }),
);

export function BaseControlledDurationInput(props: ControlledProps) {
  const {
    field: { value, ...moreFields },
    fieldState: { error },
  } = useController(props);

  return (
    <BaseDurationInput
      {...props}
      {...moreFields}
      value={value || ''}
      errorMessage={error?.message}
    />
  );
}
