import {
  Fragment,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Popover, Transition } from '@headlessui/react';
import { usePopper } from 'react-popper';
import { useController } from 'react-hook-form';
import { AnimatePresence } from 'framer-motion';
import cx from 'classix';
import dayjs from 'dayjs';

import { menuTransition } from '#/utils/animation.util';
import { BaseCalendarSelector } from './base-calendar-selector.component';
import { BaseCalendar } from './base-calendar.component';
import { BaseIcon } from './base-icon.component';
import { BaseSurface } from './base-surface.component';

import type { ComponentProps } from 'react';
import type {
  ControllerRenderProps,
  UseControllerProps,
} from 'react-hook-form';
import type { IconName } from '#/base/models/base.model';

type Props = ComponentProps<'div'> & {
  name?: string;
  value?: string;
  valueFormat?: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  iconName?: IconName;
  fullWidth?: boolean;
  asterisk?: boolean;
  required?: boolean;
  disabled?: boolean;
  buttonProps?: ComponentProps<typeof Popover.Button>;
  calendarSelectorProps?: ComponentProps<typeof BaseCalendarSelector>;
  calendarProps?: ComponentProps<typeof BaseCalendar>;
  onChange?: ControllerRenderProps['onChange'];
};

export const BaseDatePicker = memo(
  forwardRef<HTMLDivElement, Props>(function (
    {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      name,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      id,
      className,
      value,
      valueFormat = 'MMMM DD, YYYY',
      label,
      description,
      errorMessage,
      iconName,
      fullWidth,
      asterisk,
      required,
      disabled,
      buttonProps: { className: buttonClassName, ...moreButtonProps } = {},
      calendarSelectorProps,
      calendarProps: { className: calendarClassName, ...moreCalendarProps } = {
        currentDate: new Date(),
      },
      onChange,
      ...moreProps
    },
    ref,
  ) {
    const [localValue, setLocalValue] = useState<string | undefined>(value);
    const [currentDate, setCurrentDate] = useState<Date>(
      value ? dayjs(value).toDate() : new Date(),
    );
    const [isSelectorExpanded, setIsSelectorExpanded] = useState(false);
    const [buttonRef, setButtonRef] = useState<any>(undefined);
    const [popperRef, setPopperRef] = useState<any>(undefined);
    const {
      styles: { popper: popperStyles },
      attributes,
      state,
    } = usePopper(buttonRef, popperRef, {
      placement: 'bottom-start',
    });

    const formattedValue = useMemo(() => {
      if (!localValue && !value) {
        return undefined;
      }
      return dayjs(localValue || value).format(valueFormat);
    }, [localValue, value, valueFormat]);

    useEffect(() => {
      if (state) {
        return;
      }

      !dayjs(localValue).isSame(currentDate, 'month') &&
        setCurrentDate(dayjs(localValue).toDate());
    }, [localValue, currentDate, state]);

    const handleSelectorExpand = useCallback(
      (isExpand: boolean) => setIsSelectorExpanded(isExpand),
      [],
    );

    useEffect(() => {
      if (value) {
        return;
      }

      setLocalValue(value);
    }, [value]);

    const handleCurrentDateChange = useCallback((date: Date) => {
      setCurrentDate(date);
    }, []);

    const handleSelectedDateChange = useCallback(
      (date: Date, cb?: () => void) => {
        setCurrentDate(date);
        setLocalValue(date.toString());
        !!onChange && onChange(date);
        !!cb && cb();
      },
      [onChange],
    );

    return (
      <div
        ref={ref}
        className={cx(
          'relative w-full',
          !fullWidth && 'max-w-input',
          className,
        )}
        {...moreProps}
      >
        <Popover className='relative'>
          {({ open, close }) => (
            <>
              <Popover.Button
                ref={setButtonRef}
                className={cx(
                  `group mb-0.5 flex h-input w-full items-center rounded-md border-2 border-accent/40 bg-white pl-18px pr-4
            text-left text-accent !outline-none transition-all focus:!border-primary-focus focus:!ring-1 focus:!ring-primary-focus group-disabled:!bg-backdrop-gray`,
                  !!iconName && '!pl-[13px]',
                  !!errorMessage && '!border-red-500/60',
                  disabled && '!pointer-events-none !bg-backdrop-gray',
                  buttonClassName,
                )}
                disabled={disabled}
                {...moreButtonProps}
              >
                <div
                  className={cx(
                    'relative h-full w-full pb-2 pt-26px',
                    !!iconName && 'pl-[31px]',
                  )}
                >
                  {!!iconName && (
                    <BaseIcon
                      name={iconName}
                      size={22}
                      className={cx(
                        'absolute left-0 top-1/2 -translate-y-1/2 group-focus:!text-primary',
                        !!errorMessage && '!text-red-500',
                      )}
                    />
                  )}
                  {!!label && (
                    <span
                      className={cx(
                        `absolute left-0 top-1/2 -translate-y-1/2 font-bold text-accent/70 transition-all group-focus:!text-primary`,
                        localValue !== undefined &&
                          '!-translate-y-111 !text-13px after:!top-0',
                        !!iconName && '!left-[31px]',
                        !!errorMessage && '!text-red-500',
                        (asterisk || required) &&
                          "after:absolute after:top-0.5 after:pl-1.5 after:text-xl after:text-yellow-500 after:content-['*']",
                      )}
                    >
                      {label}
                    </span>
                  )}
                  {formattedValue}
                </div>
              </Popover.Button>
              <AnimatePresence>
                <Popover.Panel
                  className='absolute z-max mt-2.5'
                  ref={setPopperRef}
                  style={popperStyles}
                  {...attributes.popper}
                >
                  <Transition as={Fragment} show={open} appear>
                    <Transition.Child as='div' {...menuTransition}>
                      <BaseSurface
                        className='flex h-[352px] w-[336px] flex-col overflow-hidden !p-0 drop-shadow-primary-sm'
                        rounded='xs'
                      >
                        <BaseCalendarSelector
                          currentDate={currentDate}
                          isExpanded={isSelectorExpanded}
                          onExpand={handleSelectorExpand}
                          onChange={handleCurrentDateChange}
                          {...calendarSelectorProps}
                        />
                        {!isSelectorExpanded && (
                          <div
                            key={currentDate.toString()}
                            className='flex w-full flex-1'
                          >
                            <BaseCalendar
                              className={cx(
                                'flex-1 border-t border-t-primary-border-light',
                                calendarClassName,
                              )}
                              onChange={(date: Date) =>
                                handleSelectedDateChange(date, close)
                              }
                              {...moreCalendarProps}
                              currentDate={currentDate}
                              selectedDate={localValue}
                            />
                          </div>
                        )}
                      </BaseSurface>
                    </Transition.Child>
                  </Transition>
                </Popover.Panel>
              </AnimatePresence>
            </>
          )}
        </Popover>
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

export function BaseControlledDatePicker(
  props: Props & UseControllerProps<any>,
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return <BaseDatePicker {...props} {...field} errorMessage={error?.message} />;
}
