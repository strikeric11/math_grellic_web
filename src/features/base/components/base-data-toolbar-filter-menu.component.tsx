import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Popover, Transition } from '@headlessui/react';
import {
  offset,
  useClick,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
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
  singleFilterOnly?: boolean;
  buttonProps?: ComponentProps<typeof BaseButton>;
  onSubmit?: (options: QueryFilterOption[]) => void;
};

export const BaseDataToolbarFilterMenu = memo(function ({
  className,
  options,
  defaulSelectedtOptions,
  submitButtonLabel = 'Apply',
  allowNoFilters,
  singleFilterOnly,
  buttonProps: { className: buttonClassName, ...moreButtonProps } = {},
  onSubmit,
  ...moreProps
}: Props) {
  // Set and configure popover
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10)],
    placement: 'bottom-end',
  });
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click]);
  // --------------------------

  const [selectedOptions, setSelectedOptions] = useState<QueryFilterOption[]>(
    defaulSelectedtOptions || [],
  );

  const [currentSelectedOptions, setCurrentSelectedOptions] =
    useState<QueryFilterOption[]>(selectedOptions);

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
          return singleFilterOnly ? [option] : [...prev, option];
        }
      }),
    [singleFilterOnly],
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

  useEffect(() => {
    setSelectedOptions(currentSelectedOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Popover className={cx('relative', className)} {...moreProps}>
      {({ open, close }) => (
        <>
          <Popover.Button
            ref={refs.setReference}
            as={BaseButton}
            className={cx(
              '!p-2 !text-sm font-medium',
              !currentSelectedOptions.length
                ? '!border-transparent'
                : '!pr-2.5',
              buttonClassName,
            )}
            variant='border'
            size='sm'
            onClick={handleOpenMenu}
            bodyFont
            {...moreButtonProps}
            {...getReferenceProps()}
          >
            <span className='hidden md:inline'>{buttonLabel}</span>
          </Popover.Button>
          <Transition as={Fragment} show={open} appear>
            <Popover.Panel
              ref={refs.setFloating}
              style={floatingStyles}
              className='z-max'
              {...getFloatingProps()}
            >
              <Transition.Child as='div' {...menuTransition}>
                <BaseSurface
                  className='min-w-[250px] overflow-hidden !p-2.5 drop-shadow-primary-sm'
                  rounded='xs'
                >
                  <div className='mb-3 flex w-full flex-col'>
                    {options.map((option) => (
                      <BaseDropdownButton
                        key={option.key}
                        checked={isChecked(option)}
                        iconName='feather'
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
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
});
