import { memo } from 'react';
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
  filterOptions: QueryFilterOption[];
  sortOptions: QuerySortOption[];
  defaulSelectedtFilterOptions?: QueryFilterOption[];
  defaultSelectedSort?: QuerySort;
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

export const BaseDataToolbar = memo(
  ({
    className,
    filterOptions,
    defaulSelectedtFilterOptions,
    defaultSelectedSort,
    sortOptions,
    onSearchChange,
    onRefresh,
    onFilter,
    onSort,
    ...moreProps
  }: Props) => {
    return (
      <div
        className={cx('flex w-full items-center justify-between', className)}
        {...moreProps}
      >
        <BaseSearchInput
          placeholder='Find a lesson'
          onChange={onSearchChange}
        />
        <div className='flex items-center gap-2.5'>
          <BaseDataToolbarFilterMenu
            options={filterOptions}
            defaulSelectedtOptions={defaulSelectedtFilterOptions}
            submitButtonLabel='Apply Filter'
            buttonProps={filterButtonProps}
            onSubmit={onFilter}
          />
          <BaseDataToolbarSorterMenu
            options={sortOptions}
            defaultSelectedSort={defaultSelectedSort}
            submitButtonLabel='Apply Sort'
            buttonProps={sortButtonProps}
            onSubmit={onSort}
          />
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
