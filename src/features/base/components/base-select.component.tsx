import {
  Fragment,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { useController } from 'react-hook-form';
import cx from 'classix';

import { menuTransition } from '#/utils/animation.util';
import { BaseDropdownButton } from './base-dropdown-button.component';
import { BaseIcon } from './base-icon.component';
import { BaseSurface } from './base-surface.component';

import type { ComponentProps } from 'react';
import type {
  ControllerRenderProps,
  UseControllerProps,
} from 'react-hook-form';
import type { IconName, SelectOption } from '../models/base.model';

type Props = Omit<ComponentProps<typeof Listbox>, 'onChange'> & {
  options: SelectOption[];
  optionSize?: 'base' | 'sm';
  name?: string;
  value?: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  iconName?: IconName;
  fullWidth?: boolean;
  asterisk?: boolean;
  required?: boolean;
  buttonProps?: ComponentProps<typeof Listbox.Button>;
  onChange?: ControllerRenderProps['onChange'];
};

export const BaseSelect = memo(
  forwardRef<HTMLDivElement, Props>(function (
    {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      name,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      id,
      className,
      options,
      optionSize = 'base',
      value,
      label,
      description,
      errorMessage,
      iconName,
      fullWidth,
      asterisk,
      required,
      disabled,
      buttonProps: { className: buttonClassName, ...moreButtonProps } = {},
      onChange,
      ...moreProps
    },
    ref,
  ) {
    const [localValue, setLocalValue] = useState<string | undefined>(value);

    const targetValue = useMemo(
      () => value || localValue || null,
      [value, localValue],
    );

    const currentLabel = useMemo(
      () => options.find((option) => option.value == targetValue)?.label,
      [targetValue, options],
    );

    const handleChange = useCallback(
      (value: string) => {
        setLocalValue(value);
        !!onChange && onChange(value);
      },
      [onChange],
    );

    useEffect(() => {
      if (value) {
        return;
      }

      setLocalValue(value);
    }, [value]);

    return (
      <Listbox
        as='div'
        ref={ref}
        className={cx(
          'relative w-full',
          !fullWidth && 'max-w-input',
          className,
        )}
        value={targetValue}
        onChange={handleChange}
        {...moreProps}
      >
        <Listbox.Button
          className={cx(
            `group/select mb-0.5 flex h-input w-full items-center rounded-md border-2 border-accent/40 bg-white pl-18px pr-4 text-left text-accent !outline-none
              transition-all focus:!border-primary-focus focus:!ring-1 focus:!ring-primary-focus group-disabled/field:!bg-backdrop-gray group-disabled/select:!bg-backdrop-gray`,
            !!iconName && '!pl-[13px]',
            !!errorMessage && '!border-red-500/60',
            disabled && '!pointer-events-none !bg-backdrop-gray',
            buttonClassName,
          )}
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
                  'absolute left-0 top-1/2 -translate-y-1/2 group-focus/select:!text-primary',
                  !!errorMessage && '!text-red-500',
                )}
              />
            )}
            {!!label && (
              <span
                className={cx(
                  `absolute left-0 top-1/2 -translate-y-1/2 font-medium text-accent/70 transition-all group-focus/select:!text-primary`,
                  targetValue != null &&
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
            {currentLabel}
          </div>
          <BaseIcon
            name='caret-down'
            size={22}
            weight='fill'
            className='shrink-0 group-hover/select:!text-primary group-focus/select:!text-primary'
          />
        </Listbox.Button>
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
        <Transition as={Fragment} {...menuTransition}>
          <Listbox.Options
            as={BaseSurface}
            className='absolute left-0 top-full z-50 mt-2.5 w-full !p-1.5 drop-shadow-primary-sm'
            rounded='xs'
          >
            {options.map(
              ({ label: opLabel, value: opValue, iconName: opIconName }) => (
                <Listbox.Option
                  as={BaseDropdownButton}
                  key={opValue}
                  value={opValue}
                  checked={targetValue === opValue}
                  size={optionSize}
                  iconName={opIconName}
                  className={({ active }: { active: boolean }) =>
                    active ? '!bg-primary !text-white' : ''
                  }
                >
                  {opLabel}
                </Listbox.Option>
              ),
            )}
          </Listbox.Options>
        </Transition>
      </Listbox>
    );
  }),
);

export function BaseControlledSelect(props: Props & UseControllerProps<any>) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return <BaseSelect {...props} {...field} errorMessage={error?.message} />;
}
