import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import cx from 'classix';

import { transformToActivity } from '#/activity/helpers/activity-transform.helper';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { getStudentActivitiesByPublicIdAndCurrentTeacherUser } from '../api/teacher-performance.api';
import { StudentActivityPerformanceDetails } from './student-activity-performance-details.component';

import type { ComponentProps } from 'react';
import type { Activity } from '#/activity/models/activity.model';

type Props = ComponentProps<'div'> & {
  onActivityClick: (activity?: Activity) => void;
};

export const TeacherStudentActivityPerformanceList = memo(function ({
  className,
  onActivityClick,
  ...moreProps
}: Props) {
  const { publicId } = useParams();

  const {
    data: activities,
    isFetching,
    isLoading,
  } = useQuery(
    getStudentActivitiesByPublicIdAndCurrentTeacherUser(
      { publicId: publicId || '' },
      {
        refetchOnWindowFocus: false,
        enabled: !!publicId,
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
