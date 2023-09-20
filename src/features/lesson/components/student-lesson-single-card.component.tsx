import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import cx from 'classix';

import { convertSecondsToDuration } from '#/utils/time.util';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '../models/lesson.model';

type Props = ComponentProps<typeof BaseSurface> & {
  lesson: Lesson;
  primary?: boolean;
  upcoming?: boolean;
  // TODO websocket upcoming countdown
};

export const StudentLessonSingleCard = memo(function ({
  className,
  lesson,
  primary,
  upcoming,
  ...moreProps
}: Props) {
  const singleTo = useMemo(() => lesson.slug, [lesson]);
  const orderNumber = useMemo(() => lesson.orderNumber, [lesson]);
  const title = useMemo(() => lesson.title, [lesson]);
  const excerpt = useMemo(() => lesson.excerpt, [lesson]);
  const isCompleted = useMemo(() => !!lesson.completions?.length, [lesson]);

  const duration = useMemo(
    () => convertSecondsToDuration(lesson.durationSeconds || 0, true),
    [lesson],
  );

  const [scheduleDate, scheduleTime] = useMemo(() => {
    if (!lesson.schedules?.length) {
      return [];
    }

    return [
      dayjs(lesson.schedules[0].startDate).format('MMM DD, YYYY'),
      dayjs(lesson.schedules[0].startDate).format('hh:mm A'),
    ];
  }, [lesson]);

  return (
    <Link to={singleTo} className='group'>
      <BaseSurface
        className={cx(
          'flex w-full flex-col gap-y-2.5 !py-2.5 !pl-2.5 !pr-5 transition-all group-hover:-translate-y-1 group-hover:ring-1',
          primary
            ? 'primary !border-accent !bg-primary group-hover:!border-primary-focus group-hover:ring-primary-focus group-hover:drop-shadow-primary'
            : 'group-hover:ring-primary-focus group-hover:drop-shadow-primary',
          className,
        )}
        rounded='sm'
        {...moreProps}
      >
        <div className='flex w-full items-center gap-x-4'>
          {/* Image */}
          <div
            className={`flex h-[90px] w-[161px] items-center justify-center overflow-hidden rounded border
            border-primary bg-primary-focus-light/30 text-primary [.primary_&]:border-accent [.primary_&]:bg-white/30 [.primary_&]:text-accent`}
          >
            <BaseIcon name='chalkboard-teacher' size={40} weight='light' />
          </div>
          <div className='flex flex-1'>
            <div className='flex flex-1 flex-col gap-y-3'>
              {/* Title and status */}
              <div className='flex w-full items-center'>
                <h2 className='flex-1 font-body text-lg font-medium tracking-normal text-accent [.primary_&]:text-white'>
                  {title}
                </h2>
                {!upcoming && (
                  <div className='flex w-20 justify-center'>
                    {!isCompleted ? (
                      <BaseIcon
                        name='circle-dashed'
                        size={44}
                        className='text-accent/50 [.primary_&]:text-white/60'
                      />
                    ) : (
                      <div className='relative flex items-center justify-center'>
                        <BaseIcon
                          name='check-circle'
                          weight='fill'
                          className='relative z-10 text-green-500'
                          size={44}
                        />
                        <div className='absolute h-6 w-6 bg-white' />
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Info chips */}
              <div className='flex w-full items-center justify-between [.primary_&]:text-white'>
                <div className='flex items-center gap-2.5'>
                  <BaseChip iconName='chalkboard-teacher'>
                    Lesson {orderNumber}
                  </BaseChip>
                  <BaseDivider
                    className='!h-6 [.primary_&]:border-white/20'
                    vertical
                  />
                  <BaseChip iconName='hourglass'>{duration}</BaseChip>
                </div>
                {!upcoming && scheduleDate && (
                  <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
                )}
              </div>
            </div>
          </div>
          {upcoming && scheduleDate && (
            <div className='w-[276px]'>
              <small className='mb-1 block w-full text-right font-medium uppercase [.primary_&]:text-white'>
                Available On
              </small>
              <div className='w-full overflow-hidden rounded border border-accent [.primary_&]:border-white'>
                <div className='flex min-h-[24px] w-full items-center justify-center bg-primary [.primary_&]:bg-white'>
                  <small className='font-medium uppercase text-white [.primary_&]:text-primary'>
                    {/* TODO countdown */}
                    10 days : 16 hrs : 30 mins
                  </small>
                </div>
                <div className='flex w-full items-center justify-center gap-2.5 border-t border-t-accent [.primary_&]:border-t-white [.primary_&]:text-white'>
                  <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
                  <BaseDivider
                    className='!h-6 [.primary_&]:border-white/20'
                    vertical
                  />
                  <BaseChip iconName='calendar-check'>{scheduleTime}</BaseChip>
                </div>
              </div>
            </div>
          )}
        </div>
        {excerpt && (
          <div className='pb-1.5 [.primary_&]:text-white'>
            <p className='line-clamp-2 h-10 text-sm'>{excerpt}</p>
          </div>
        )}
      </BaseSurface>
    </Link>
  );
});

export const StudentLessonSingleCardSkeleton = memo(function () {
  return (
    <div className='flex w-full animate-pulse items-center justify-between gap-x-4 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-5'>
      <div className='h-[90px] w-[161px] rounded bg-accent/20' />
      <div className='flex h-fit flex-1 flex-col gap-y-5'>
        <div className='h-6 w-[200px] rounded bg-accent/20' />
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-2.5'>
            <div className='h-6 w-28 rounded bg-accent/20' />
            <div className='h-6 w-28 rounded bg-accent/20' />
          </div>
          <div className='h-6 w-28 rounded bg-accent/20' />
        </div>
      </div>
    </div>
  );
});
