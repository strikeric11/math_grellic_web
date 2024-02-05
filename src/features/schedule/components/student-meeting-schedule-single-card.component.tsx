import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { getDayJsDuration, convertSecondsToDuration } from '#/utils/time.util';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { MeetingSchedule } from '../models/schedule.model';

type Props = ComponentProps<typeof BaseSurface> & {
  meetingSchedule: MeetingSchedule;
  primary?: boolean;
};

export const StudentMeetingScheduleSingleCard = memo(function ({
  className,
  meetingSchedule,
  primary,
  ...moreProps
}: Props) {
  const [to, title, meetingUrl] = useMemo(
    () => [
      meetingSchedule.id.toString(),
      meetingSchedule.title,
      meetingSchedule.meetingUrl,
    ],
    [meetingSchedule],
  );

  const [scheduleDate, scheduleTime, scheduleDuration] = useMemo(() => {
    const date = dayjs(meetingSchedule.startDate).format('MMM DD, YYYY');

    const time = `${dayjs(meetingSchedule.startDate).format(
      'hh:mm A',
    )} — ${dayjs(meetingSchedule.endDate).format('hh:mm A')}`;

    const duration = getDayJsDuration(
      meetingSchedule.endDate,
      meetingSchedule.startDate,
    ).asSeconds();

    return [date, time, convertSecondsToDuration(duration)];
  }, [meetingSchedule]);

  return (
    <Link to={to} className='group'>
      <BaseSurface
        className={cx(
          'flex w-full flex-col gap-2.5 !py-2.5 !pl-2.5 !pr-5 transition-all group-hover:-translate-y-1 group-hover:ring-1',
          primary
            ? 'primary !border-accent !bg-primary-hue-orange group-hover:!border-primary-hue-orange-focus group-hover:ring-primary-hue-orange-focus group-hover:drop-shadow-primary'
            : 'group-hover:ring-primary-hue-orange-focus group-hover:drop-shadow-primary',
          className,
        )}
        rounded='sm'
        {...moreProps}
      >
        <div className='flex h-full flex-1 flex-col items-start gap-4 md:flex-row md:items-center'>
          <div className='flex h-full flex-1 items-center gap-4'>
            <div
              className={cx(
                'flex h-[90px] w-[121px] items-center justify-center overflow-hidden rounded border border-primary-hue-orange bg-primary-hue-orange-focus/30 text-primary-hue-orange',
                '[.primary_&]:border-accent [.primary_&]:bg-white/50 [.primary_&]:text-accent',
              )}
            >
              <BaseIcon name='presentation' size={40} weight='light' />
            </div>
            <div className='flex h-full flex-1 flex-col justify-between gap-2 py-1.5'>
              {/* Title */}
              <h2 className='font-body text-lg font-medium tracking-normal text-accent [.primary_&]:text-white'>
                {title}
              </h2>
              <div className='flex justify-start'>
                <BaseLink
                  to={meetingUrl}
                  target='_blank'
                  className='!font-body font-medium !leading-tight sm:!leading-normal [.primary_&]:text-white'
                  rightIconName='arrow-square-out'
                  size='sm'
                >
                  {meetingUrl}
                </BaseLink>
              </div>
            </div>
          </div>
          <div className='flex min-w-[190px] flex-row justify-center gap-2.5 md:flex-col md:gap-1 [.primary_&]:text-white'>
            <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
            <BaseDivider className='block !h-6 md:hidden' vertical />
            <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
            <BaseDivider className='block !h-6 md:hidden' vertical />
            <BaseChip iconName='hourglass'>{scheduleDuration}</BaseChip>
          </div>
        </div>
      </BaseSurface>
    </Link>
  );
});

export const StudentMeetingScheduleSingleCardSkeleton = memo(function () {
  return (
    <div className='flex min-h-[106px] w-full animate-pulse flex-wrap justify-between gap-x-4 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-4 md:flex-nowrap'>
      <div className='h-[86px] w-[120px] rounded bg-accent/20' />
      <div className='flex flex-1 flex-col justify-between gap-3 py-2.5'>
        <div className='h-6 w-[200px] rounded bg-accent/20' />
        <div className='h-6 w-72 rounded bg-accent/20' />
      </div>
      <div className='mt-2.5 flex w-full gap-5 md:mt-0 md:w-auto'>
        <div className='flex flex-col gap-1.5'>
          <div className='h-6 w-48 rounded bg-accent/20' />
          <div className='h-6 w-48 rounded bg-accent/20' />
          <div className='h-6 w-48 rounded bg-accent/20' />
        </div>
        <div className='w-5 rounded bg-accent/20' />
      </div>
    </div>
  );
});
