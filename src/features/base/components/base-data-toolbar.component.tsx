import { memo, useEffect } from 'react';
import cx from 'classix';

import { BaseButton } from './base-button.components';
import { BaseSearchInput } from './base-search-input.component';
import { BaseIconButton } from './base-icon-button.component';
import { BaseTooltip } from './base-tooltip.component';
import { BaseDataToolbarFilterMenu } from './base-data-toolbar-filter-menu.component';
import { BaseDataToolbarSorterMenu } from './base-data-toolbar-sorter-menu.component';

import type { ComponentProps } from 'react';
import type {
  QueryFilterOption,
  QuerySort,
  QuerySortOption,
} from '../models/base.model';

type Props = ComponentProps<'div'> & {
  filterOptions?: QueryFilterOption[];
  sortOptions?: QuerySortOption[];
  defaulSelectedtFilterOptions?: QueryFilterOption[];
  defaultSelectedSort?: QuerySort;
  singleFilterOnly?: boolean;
  onSearchChange?: (value: string | null) => void;
  onRefresh?: () => void;
  onFilter?: (value: QueryFilterOption[]) => void;
  onSort?: (value: QuerySort) => void;
};

const filterButtonProps = { leftIconName: 'funnel' } as ComponentProps<
  typeof BaseButton
>;

const sortButtonProps = { leftIconName: 'list-bullets' } as ComponentProps<
  typeof BaseButton
>;

const searchWrapperProps = {
  className: '-2xs:!max-w-input !max-w-full w-full',
};

export const BaseDataToolbar = memo(
  ({
    className,
    filterOptions,
    defaulSelectedtFilterOptions,
    defaultSelectedSort,
    singleFilterOnly,
    sortOptions,
    onSearchChange,
    onRefresh,
    onFilter,
    onSort,
    ...moreProps
  }: Props) => {
    useEffect(() => {
      if (onFilter && defaulSelectedtFilterOptions) {
        onFilter(defaulSelectedtFilterOptions);
      }

      if (onSort && defaultSelectedSort) {
        onSort(defaultSelectedSort);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        className={cx(
          'flex w-full flex-col items-center justify-between gap-2.5 -2xs:flex-row -2xs:gap-0',
          className,
        )}
        {...moreProps}
      >
        <BaseSearchInput
          className='w-full md:w-auto'
          placeholder='Find a lesson'
          wrapperProps={searchWrapperProps}
          onChange={onSearchChange}
        />
        <div className='flex w-full items-center justify-between gap-2.5 -2xs:w-fit -2xs:justify-start'>
          <div className='order-last flex items-center gap-2.5 -2xs:order-first'>
            {filterOptions && (
              <BaseDataToolbarFilterMenu
                options={filterOptions}
                defaulSelectedtOptions={defaulSelectedtFilterOptions}
                submitButtonLabel='Apply Filter'
                singleFilterOnly={singleFilterOnly}
                buttonProps={filterButtonProps}
                onSubmit={onFilter}
              />
            )}
            {sortOptions && (
              <BaseDataToolbarSorterMenu
                options={sortOptions}
                defaultSelectedSort={defaultSelectedSort}
                submitButtonLabel='Apply Sort'
                buttonProps={sortButtonProps}
                onSubmit={onSort}
              />
            )}
          </div>
          <BaseTooltip content='Refresh'>
            <BaseIconButton
              name='arrow-clockwise'
              variant='link'
              size='sm'
              onClick={onRefresh}
            />
          </BaseTooltip>
        </div>
      </div>
    );
  },
);
