import { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { activityGameLabel } from '#/activity/models/activity.model';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import {
  StudentActivitySingleCard,
  StudentActivitySingleCardSkeleton,
} from '#/activity/components/student-activity-single-card.component';

import type { ComponentProps } from 'react';
import type { Activity, ActivityGame } from '#/activity/models/activity.model';

type Props = ComponentProps<'div'> & {
  activities: Activity[];
  loading?: boolean;
};

const ACTIVITY_LIST_PATH = `/${studentBaseRoute}/${studentRoutes.activity.to}`;

const ActivityCompactCard = memo(function ({
  activity,
}: {
  activity: Activity;
}) {
  const [singleTo, orderNumber, title, gameName, score] = useMemo(
    () => [
      `${ACTIVITY_LIST_PATH}/${activity.slug}`,
      activity.orderNumber,
      activity.title,
      activityGameLabel[activity.game.name as ActivityGame],
      activity.score != null ? activity.score : null,
    ],
    [activity],
  );

  return (
    <Link to={singleTo} className='group'>
      <BaseSurface className='flex items-start rounded-lg !p-2.5 transition-all group-hover:-translate-y-1 group-hover:ring-1'>
        <div className='flex w-full flex-col gap-2.5'>
          <div className='flex items-center gap-2.5'>
            <BaseChip iconName='game-controller' className='text-sm'>
              Activity {orderNumber}
            </BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='dice-three' className='text-sm'>
              {gameName}
            </BaseChip>
          </div>
          <h2 className='flex-1 pl-1 font-body text-base font-medium tracking-normal text-accent [.primary_&]:text-white'>
            {title}
          </h2>
        </div>
        <div className='flex justify-center'>
          {score == null ? (
            <BaseIcon
              name='circle-dashed'
              size={30}
              className='text-accent/50 [.primary_&]:text-white/60'
            />
          ) : (
            <div className='relative flex items-center justify-center'>
              <BaseIcon
                name='check-circle'
                weight='fill'
                className='relative z-10 text-green-500'
                size={30}
              />
              <div className='absolute h-6 w-6 bg-white' />
            </div>
          )}
        </div>
      </BaseSurface>
    </Link>
  );
});

export const StudentDashboardActivityList = memo(function ({
  className,
  loading,
  activities,
  ...moreProps
}: Props) {
  const featuredActivities = useMemo(
    () => activities?.slice(0, 2) || [],
    [activities],
  );

  const moreActivities = useMemo(
    () => activities?.slice(2, 4) || [],
    [activities],
  );

  return (
    <div
      className={cx('w-full', loading && 'flex flex-col gap-2.5', className)}
      {...moreProps}
    >
      {loading ? (
        [...Array(2)].map((_, index) => (
          <StudentActivitySingleCardSkeleton key={index} />
        ))
      ) : (
        <>
          <div className='flex flex-col gap-2.5'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg'>Latest Lessons</h3>
              <BaseLink
                to={ACTIVITY_LIST_PATH}
                rightIconName='arrow-circle-right'
                size='xs'
              >
                View All Activities
              </BaseLink>
            </div>
            {!!featuredActivities.length &&
              featuredActivities.map((activity, index) => (
                <StudentActivitySingleCard
                  key={`fa-${activity.id}`}
                  activity={activity}
                  primary={index <= 0}
                  isDashboard
                />
              ))}
          </div>
          <BaseDivider className='mb-2.5 pt-4' />
          <div>
            <h3 className='mb-2.5 text-lg'>More Activities</h3>
            {moreActivities.length ? (
              <ul className='-2lg:flex-row -2lg:gap-5 flex flex-col items-center gap-2.5 xl:flex-col xl:gap-4 2xl:flex-row 2xl:gap-5'>
                {moreActivities.map((activity) => (
                  <li key={`a-${activity.id}`} className='w-full'>
                    <ActivityCompactCard activity={activity} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className='w-full py-4 text-center'>
                No activities to show
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
});
