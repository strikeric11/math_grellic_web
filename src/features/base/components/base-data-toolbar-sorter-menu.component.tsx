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
import type {
  IconName,
  QuerySort,
  QuerySortOption,
} from '../models/base.model';
import { BaseDivider } from './base-divider.component';

type Props = ComponentProps<typeof Popover> & {
  options: QuerySortOption[];
  defaultSelectedSort?: QuerySort;
  submitButtonLabel?: string;
  buttonProps?: ComponentProps<typeof BaseButton>;
  onSubmit?: (sort: QuerySort) => void;
};

const orderOptions = [
  { value: 'asc', label: 'Ascending', iconName: 'sort-ascending' },
  { value: 'desc', label: 'Descending', iconName: 'sort-descending' },
];

export const BaseDataToolbarSorterMenu = memo(function ({
  className,
  options,
  defaultSelectedSort,
  submitButtonLabel,
  buttonProps: { className: buttonClassName, ...moreButtonProps } = {},
  onSubmit,
  ...moreProps
}: Props) {
  const [selectedSort, setSelectedSort] = useState<QuerySort>(
    defaultSelectedSort || ({} as QuerySort),
  );
  const [currentSelectedSort, setCurrentSelectedSort] =
    useState<QuerySort>(selectedSort);

  const [buttonRef, setButtonRef] = useState<any>(undefined);
  const [popperRef, setPopperRef] = useState<any>(undefined);

  const {
    styles: { popper: popperStyles },
    attributes,
  } = usePopper(buttonRef, popperRef, {
    placement: 'bottom-end',
  });

  const buttonLabel = useMemo(() => {
    if (!Object.keys(currentSelectedSort)?.length) {
      return '';
    }

    const { label } =
      options.find((option) => option.value === currentSelectedSort.field) ||
      {};

    return `${label}, ${currentSelectedSort.order.toUpperCase()}`;
  }, [options, currentSelectedSort]);

  const isChecked = useCallback(
    (value: string) => {
      if (!selectedSort.field?.trim()) {
        return false;
      }
      return selectedSort.field === value;
    },
    [selectedSort],
  );

  const isOrderChecked = useCallback(
    (value: string) => {
      if (!selectedSort.order?.trim()) {
        return false;
      }
      return selectedSort.order === value;
    },
    [selectedSort],
  );

  const handleOpenMenu = useCallback(() => {
    setSelectedSort(currentSelectedSort);
  }, [currentSelectedSort]);

  const handleOptionSelect = useCallback(
    (value: string) => () =>
      setSelectedSort((prev) => ({ ...prev, field: value })),
    [],
  );

  const handleOrderSelect = useCallback(
    (value: string) => () =>
      setSelectedSort((prev) => ({
        ...prev,
        order: value as QuerySort['order'],
      })),
    [],
  );

  const handleSubmit = useCallback(
    (close: () => void) => () => {
      if (!selectedSort.field?.trim()) {
        toast.error('Select at least one option');
        return;
      }

      setCurrentSelectedSort(selectedSort);
      onSubmit && onSubmit(selectedSort);
      close();
    },
    [selectedSort, onSubmit],
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
              !currentSelectedSort.field?.trim()
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
                  className='min-w-[250px] overflow-hidden !p-2.5 drop-shadow-primary-sm'
                  rounded='xs'
                >
                  <div className='mb-3 flex w-full flex-col'>
                    {options.map(({ value, label }) => (
                      <BaseDropdownButton
                        key={value}
                        checked={isChecked(value)}
                        iconName='feather'
                        onClick={handleOptionSelect(value)}
                        alwaysShowCheck
                      >
                        {label}
                      </BaseDropdownButton>
                    ))}
                    <BaseDivider className='my-2' />
                    {orderOptions.map(({ value, label, iconName }) => (
                      <BaseDropdownButton
                        key={value}
                        checked={isOrderChecked(value)}
                        iconName={iconName as IconName}
                        onClick={handleOrderSelect(value)}
                        alwaysShowCheck
                      >
                        {label}
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
