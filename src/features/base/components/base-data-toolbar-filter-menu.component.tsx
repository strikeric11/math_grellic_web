import { Fragment, memo, useCallback, useMemo, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { usePopper } from 'react-popper';
import toast from 'react-hot-toast';
import cx from 'classix';

import { menuTransition } from '#/utils/animation.util';
import { BaseButton } from './base-button.components';
import { BaseSurface } from './base-surface.component';
import { BaseDropdownButton } from './base-dropdown-button.component';

import type { ComponentProps } from 'react';
import type { QueryFilterOption } from '../models/base.model';

type Props = ComponentProps<typeof Popover> & {
  options: QueryFilterOption[];
  defaulSelectedtOptions?: QueryFilterOption[];
  submitButtonLabel?: string;
  allowNoFilters?: boolean;
  buttonProps?: ComponentProps<typeof BaseButton>;
  onSubmit?: (options: QueryFilterOption[]) => void;
};

export const BaseDataToolbarFilterMenu = memo(function ({
  className,
  options,
  defaulSelectedtOptions,
  submitButtonLabel = 'Apply',
  allowNoFilters,
  buttonProps: { className: buttonClassName, ...moreButtonProps } = {},
  onSubmit,
  ...moreProps
}: Props) {
  const [selectedOptions, setSelectedOptions] = useState<QueryFilterOption[]>(
    defaulSelectedtOptions || [],
  );
  const [currentSelectedOptions, setCurrentSelectedOptions] =
    useState<QueryFilterOption[]>(selectedOptions);

  const [buttonRef, setButtonRef] = useState<any>(undefined);
  const [popperRef, setPopperRef] = useState<any>(undefined);

  const {
    styles: { popper: popperStyles },
    attributes,
  } = usePopper(buttonRef, popperRef, {
    placement: 'bottom-end',
  });

  const buttonLabel = useMemo(() => {
    if (!currentSelectedOptions.length) {
      return '';
    }

    return currentSelectedOptions.map((option) => option.label).join(', ');
  }, [currentSelectedOptions]);

  const isChecked = useCallback(
    (option: QueryFilterOption) => {
      if (!selectedOptions.length) {
        return false;
      }
      return selectedOptions.some((sOption) => sOption.key === option.key);
    },
    [selectedOptions],
  );

  const handleOpenMenu = useCallback(() => {
    setSelectedOptions(currentSelectedOptions);
  }, [currentSelectedOptions]);

  const handleOptionSelect = useCallback(
    (option: QueryFilterOption) => () =>
      setSelectedOptions((prev) => {
        const isExisting = prev.some((op) => op.key === option.key);
        if (isExisting) {
          return prev.filter((op) => op.key !== option.key);
        } else {
          return [...prev, option];
        }
      }),
    [],
  );

  const handleSubmit = useCallback(
    (close: () => void) => () => {
      if (!selectedOptions.length && !allowNoFilters) {
        toast.error('Select at least one option');
        return;
      }

      setCurrentSelectedOptions(selectedOptions);
      onSubmit && onSubmit(selectedOptions);
      close();
    },
    [selectedOptions, allowNoFilters, onSubmit],
  );

  return (
    <Popover className={cx('relative', className)} {...moreProps}>
      {({ open, close }) => (
        <>
          <Popover.Button
            ref={setButtonRef}
            as={BaseButton}
            className={cx(
              '!p-2 !font-body !text-sm font-medium !tracking-normal',
              !currentSelectedOptions.length
                ? '!border-transparent'
                : '!pr-2.5',
              buttonClassName,
            )}
            variant='border'
            size='sm'
            onClick={handleOpenMenu}
            {...moreButtonProps}
          >
            {buttonLabel}
          </Popover.Button>
          <Popover.Panel
            ref={setPopperRef}
            className='absolute z-max mt-2.5'
            style={popperStyles}
            {...attributes.popper}
          >
            <Transition as={Fragment} show={open} appear>
              <Transition.Child as='div' {...menuTransition}>
                <BaseSurface
                  className='min-w-[200px] overflow-hidden !px-2.5 !pb-2.5 !pt-5 drop-shadow-primary-sm'
                  rounded='xs'
                >
                  <div className='mb-3 flex w-full flex-col'>
                    {options.map((option) => (
                      <BaseDropdownButton
                        key={option.key}
                        checked={isChecked(option)}
                        onClick={handleOptionSelect(option)}
                        alwaysShowCheck
                      >
                        {option.label}
                      </BaseDropdownButton>
                    ))}
                  </div>
                  <BaseButton
                    className='w-full'
                    size='xs'
                    onClick={handleSubmit(close)}
                  >
                    {submitButtonLabel}
                  </BaseButton>
                </BaseSurface>
              </Transition.Child>
            </Transition>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
});
