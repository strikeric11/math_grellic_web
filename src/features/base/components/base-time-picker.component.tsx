import { memo, forwardRef, useState, useCallback, useMemo } from 'react';
import { PatternFormat } from 'react-number-format';
import { UseControllerProps, useController } from 'react-hook-form';
import cx from 'classix';

import { BaseInput } from './base-input.component';
import { BaseButton } from './base-button.components';

import type { ComponentProps, FocusEvent } from 'react';
import type {
  NumberFormatValues,
  PatternFormatProps,
} from 'react-number-format';

type Props = Omit<
  PatternFormatProps<ComponentProps<typeof BaseInput>>,
  'format'
>;

type ControlledProps = Props & UseControllerProps<any>;

const AM_TEXT = 'AM';
const PM_TEXT = 'PM';

export const BaseTimePicker = memo(
  forwardRef<HTMLDivElement, Props>(function (
    { value, fullWidth, onChange, onBlur, ...moreProps },
    ref,
  ) {
    const [localValue, setLocalValue] = useState<
      NumberFormatValues | undefined
    >(undefined);
    const [localTimeSuffix, setLocalTimeSuffix] = useState<string>(AM_TEXT);
    const [isFocus, setIsFocus] = useState(false);

    const formattedValue = useMemo(() => {
      if (!value?.toString().trim().length) {
        return localValue?.value;
      }

      return value.toString().replace(/[^0-9]/g, '');
    }, [value, localValue]);

    const timeSuffix = useMemo(() => {
      const regex = /[^a-zA-Z]/g;
      if (!value?.toString().replace(regex, '').length) {
        return localTimeSuffix;
      }

      return value?.toString().replace(regex, '');
    }, [value, localTimeSuffix]);

    const showTimeSuffix = useMemo(
      () =>
        isFocus ||
        value?.toString().trim().length ||
        localValue?.value.trim().length,
      [isFocus, value, localValue],
    );

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
      (values?: NumberFormatValues, isAm?: boolean) => {
        if (!onChange) {
          return;
        }

        const tSx = isAm ? AM_TEXT : PM_TEXT;
        onChange(
          values?.value.trim().length
            ? (`${values.formattedValue} ${tSx}` as any)
            : undefined,
        );
      },
      [onChange],
    );

    const handleValueChange = useCallback(
      (values: NumberFormatValues) => {
        setLocalValue(values);
        handleChange(values, localTimeSuffix === AM_TEXT);
      },
      [localTimeSuffix, handleChange],
    );

    const handleSuffixChange = useCallback(() => {
      setLocalTimeSuffix(localTimeSuffix === AM_TEXT ? PM_TEXT : AM_TEXT);
      handleChange(localValue, localTimeSuffix !== AM_TEXT);
    }, [localValue, localTimeSuffix, handleChange]);

    return (
      <div
        ref={ref}
        className={cx('relative w-full', !fullWidth && 'max-w-input')}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <PatternFormat
          {...moreProps}
          value={formattedValue}
          type='text'
          customInput={BaseInput}
          format='##:##'
          mask='_'
          allowEmptyFormatting={isFocus}
          fullWidth={fullWidth}
          onValueChange={handleValueChange}
        />
        {!!showTimeSuffix && (
          <BaseButton
            className='!absolute left-[90px] top-[25.2px] !font-body !text-base !text-accent'
            variant='link'
            onClick={handleSuffixChange}
          >
            {timeSuffix}
          </BaseButton>
        )}
      </div>
    );
  }),
);

export function BaseControlledTimePicker(props: ControlledProps) {
  const {
    field: { value, ...moreFields },
    fieldState: { error },
  } = useController(props);

  return (
    <BaseTimePicker
      {...props}
      {...moreFields}
      value={value || ''}
      errorMessage={error?.message}
    />
  );
}
