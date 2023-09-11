import { memo } from 'react';
import cx from 'classix';

import { capitalize } from '#/utils/string.util';
import { RecordStatus } from '#/core/models/core.model';
import { BaseButton } from './base-button.components';
import { BaseSearchInput } from './base-search-input.component';
import { BaseIconButton } from './base-icon-button.component';
import { BaseDataToolbarFilterMenu } from './base-data-toolbar-filter-menu.component';

import type { ComponentProps } from 'react';
import type { QueryFilterOption } from '../models/base.model';

type Props = ComponentProps<'div'> & {
  onSearchChange?: (value: string | null) => void;
  onRefresh?: () => void;
  onFilter?: (value: QueryFilterOption[]) => void;
};

const filterButtonProps = { leftIconName: 'funnel' } as ComponentProps<
  typeof BaseButton
>;

const filterOptions = [
  {
    key: 'status-published',
    name: 'status',
    value: RecordStatus.Published,
    label: capitalize(RecordStatus.Published),
  },
  {
    key: 'status-draft',
    name: 'status',
    value: RecordStatus.Draft,
    label: capitalize(RecordStatus.Draft),
  },
];

export const BaseDataToolbar = memo(
  ({ className, onSearchChange, onRefresh, onFilter, ...moreProps }: Props) => {
    return (
      <div
        className={cx('flex w-full items-center justify-between', className)}
        {...moreProps}
      >
        <BaseSearchInput
          placeholder='Find a lesson'
          onChange={onSearchChange}
        />
        <div className='flex items-center gap-x-1'>
          <BaseIconButton
            name='arrow-clockwise'
            variant='link'
            size='sm'
            onClick={onRefresh}
          />
          <BaseDataToolbarFilterMenu
            options={filterOptions}
            defaulSelectedtOptions={filterOptions}
            submitButtonLabel='Apply Filter'
            buttonProps={filterButtonProps}
            onSubmit={onFilter}
          />
        </div>
      </div>
    );
  },
);
