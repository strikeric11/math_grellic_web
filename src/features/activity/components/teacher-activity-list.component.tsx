import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import {
  TeacherActivitySingleCard,
  TeacherActivitySingleCardSkeleton,
} from './teacher-activity-single-card.component';

import type { ComponentProps } from 'react';
import type { Activity } from '../models/activity.model';

type Props = ComponentProps<'div'> & {
  activities: Activity[];
  loading?: boolean;
  onActivityPreview?: (slug: string) => void;
  onActivityDetails?: (slug: string) => void;
  onActivityEdit?: (slug: string) => void;
};

export const TeacherActivityList = memo(function ({
  className,
  activities,
  loading,
  onActivityPreview,
  onActivityDetails,
  onActivityEdit,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => !activities?.length, [activities]);

  const handleActivityPreview = useCallback(
    (slug: string) => () => {
      onActivityPreview && onActivityPreview(slug);
    },
    [onActivityPreview],
  );

  const handleActivityDetails = useCallback(
    (slug: string) => () => {
      onActivityDetails && onActivityDetails(slug);
    },
    [onActivityDetails],
  );

  const handleActivityEdit = useCallback(
    (slug: string) => () => {
      onActivityEdit && onActivityEdit(slug);
    },
    [onActivityEdit],
  );

  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      role='table'
      {...moreProps}
    >
      {loading ? (
        [...Array(4)].map((_, index) => (
          <div key={index}>
            <TeacherActivitySingleCardSkeleton key={index} />
          </div>
        ))
      ) : isEmpty ? (
        <BaseDataEmptyMessage
          message='No activities available'
          linkTo={teacherRoutes.activity.createTo}
        />
      ) : (
        activities.map((activity) => (
          <TeacherActivitySingleCard
            key={`act-${activity.id}`}
            activity={activity}
            onPreview={handleActivityPreview(activity.slug)}
            onDetails={handleActivityDetails(activity.slug)}
            onEdit={handleActivityEdit(activity.slug)}
            role='row'
          />
        ))
      )}
    </div>
  );
});
