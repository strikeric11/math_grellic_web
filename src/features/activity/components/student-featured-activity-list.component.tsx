import { memo } from 'react';
import cx from 'classix';

import { BaseIconButton } from '#/base/components/base-icon-button.component';
import {
  StudentActivitySingleCard,
  StudentActivitySingleCardSkeleton,
} from './student-activity-single-card.component';

import type { ComponentProps } from 'react';
import type { Activity } from '../models/activity.model';

type Props = ComponentProps<'div'> & {
  featuredActivities: Activity[];
  title?: string;
  loading?: boolean;
  onRefresh?: () => void;
};

export const StudentFeaturedActivityList = memo(function ({
  className,
  featuredActivities,
  title = 'Featured Activities',
  loading,
  onRefresh,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx('flex w-full flex-col gap-2.5', className)}
      {...moreProps}
    >
      <div className='flex items-center justify-between'>
        <h2 className='text-lg'>{title}</h2>
        <BaseIconButton
          name='arrow-clockwise'
          variant='link'
          size='sm'
          onClick={onRefresh}
        />
      </div>
      {loading
        ? [...Array(2)].map((_, index) => (
            <StudentActivitySingleCardSkeleton key={index} />
          ))
        : featuredActivities.map((activity) => (
            <StudentActivitySingleCard
              key={`act-${activity.id}`}
              activity={activity}
              primary
            />
          ))}
    </div>
  );
});
