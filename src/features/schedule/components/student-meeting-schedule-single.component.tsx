import { memo, useMemo } from 'react';
import DOMPurify from 'dompurify';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { getDayJsDuration, convertSecondsToDuration } from '#/utils/time.util';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { MeetingSchedule } from '../models/schedule.model';
import { BaseDivider } from '#/base/components/base-divider.component';

type Props = ComponentProps<'div'> & {
  meetingSchedule: MeetingSchedule;
};

export const StudentMeetingScheduleSingle = memo(function ({
  className,
  meetingSchedule,
  ...moreProps
}: Props) {
  const meetingUrl = useMemo(
    () => meetingSchedule.meetingUrl,
    [meetingSchedule],
  );

  const descriptionHtml = useMemo(() => {
    const isEmpty = !DOMPurify.sanitize(meetingSchedule.description || '', {
      ALLOWED_TAGS: [],
    }).trim();

    return !isEmpty
      ? {
          __html: DOMPurify.sanitize(meetingSchedule.description || ''),
        }
      : null;
  }, [meetingSchedule]);

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
    <div className={cx('flex w-full flex-col', className)} {...moreProps}>
      <BaseSurface className='flex flex-col gap-y-2.5' rounded='sm'>
        <div className='mb-1.5 flex w-full items-center justify-between'>
          <h3 className='text-base'>Schedule</h3>
          <div className='flex items-center gap-2.5'>
            <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='hourglass'>{scheduleDuration}</BaseChip>
          </div>
        </div>
        <BaseDivider />
        <div className='flex w-full items-center justify-between'>
          <h3 className='text-base'>Meeting Link</h3>
          <div className='flex justify-start'>
            <BaseLink
              to={meetingUrl}
              target='_blank'
              className='!font-body font-medium'
              rightIconName='arrow-square-out'
              size='sm'
            >
              {meetingUrl}
            </BaseLink>
          </div>
        </div>
      </BaseSurface>
      {descriptionHtml && (
        <div
          className='base-rich-text rt-output py-8'
          dangerouslySetInnerHTML={descriptionHtml}
        />
      )}
    </div>
  );
});
