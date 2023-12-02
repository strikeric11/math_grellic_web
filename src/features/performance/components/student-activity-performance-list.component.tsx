import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import cx from 'classix';

import { BaseSpinner } from '#/base/components/base-spinner.component';
import { transformToActivity } from '#/activity/helpers/activity-transform.helper';
import { getStudentActivitiesByCurrentStudentUser } from '../api/student-performance.api';
import { StudentActivityPerformanceDetails } from './student-activity-performance-details.component';

import type { ComponentProps } from 'react';
import type { Activity } from '#/activity/models/activity.model';

type Props = ComponentProps<'div'> & {
  onActivityClick: (activity?: Activity) => void;
};

export const StudentActivityPerformanceList = memo(function ({
  className,
  onActivityClick,
  ...moreProps
}: Props) {
  const {
    data: activities,
    isFetching,
    isLoading,
  } = useQuery(
    getStudentActivitiesByCurrentStudentUser(
      {},
      {
        refetchOnWindowFocus: false,
        initialData: [],
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToActivity(item))
            : [],
      },
    ),
  );

  if (isFetching || isLoading) {
    return (
      <div className='mt-5 flex w-full justify-center'>
        <BaseSpinner />
      </div>
    );
  }

  return (
    <div className={cx('flex flex-col py-2.5', className)} {...moreProps}>
      {activities?.map((activity) => (
        <StudentActivityPerformanceDetails
          key={activity.slug}
          activity={activity}
          onClick={onActivityClick}
        />
      ))}
    </div>
  );
});
