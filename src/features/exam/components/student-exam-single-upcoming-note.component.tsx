import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import {
  convertSecondsToDuration,
  generateCountdownDate,
  getDayJsDuration,
} from '#/utils/time.util';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseIcon } from '#/base/components/base-icon.component';

import type { ComponentProps } from 'react';
import type { Duration } from 'dayjs/plugin/duration';
import type { Exam } from '../models/exam.model';

type Props = ComponentProps<'div'> & {
  exam: Exam;
  upcomingDuration: Duration;
  loading?: boolean;
};

export const StudentExamSingleUpcomingNote = memo(function LessonSingle({
  className,
  loading,
  exam,
  upcomingDuration,
  ...moreProps
}: Props) {
  const formattedUpcomingDate = useMemo(() => {
    if (!upcomingDuration) {
      return null;
    }
    return generateCountdownDate(upcomingDuration);
  }, [upcomingDuration]);

  const [scheduleDate, scheduleTime, scheduleDuration] = useMemo(() => {
    if (!exam.schedules?.length) {
      return [];
    }

    const { startDate, endDate } = exam.schedules[0];

    if (!dayjs(startDate).isSame(endDate, 'day')) {
      return [];
    }

    const date = dayjs(startDate).format('MMM DD, YYYY');
    const time = `${dayjs(startDate).format('hh:mm A')} — ${dayjs(
      endDate,
    ).format('hh:mm A')}`;
    const duration = getDayJsDuration(endDate, startDate).asSeconds();

    return [date, time, convertSecondsToDuration(duration)];
  }, [exam]);

  return (
    <div
      className={cx('flex w-full flex-col items-center', className)}
      {...moreProps}
    >
      <div className='relative mb-8 mt-5 h-[500px] w-full'>
        <div className='absolute flex w-full items-center justify-center opacity-5'>
          <BaseIcon name='exam' size={500} />
          <BaseIcon name='exam' size={500} />
        </div>
        <div className='relative z-10 mx-auto flex h-full w-full max-w-compact flex-col items-center justify-center'>
          <div className='min-w-[276px]'>
            <small className='mb-1 flex w-full items-center justify-end text-base font-medium uppercase'>
              <span className='relative mr-4 flex gap-1'>
                <span className='relative inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-primary-focus-light'></span>
                <span className='relative inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-primary-focus-light animation-delay-100'></span>
                <span className='relative inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-primary-focus-light animation-delay-200'></span>
              </span>
              Available In
            </small>
            {!loading && (
              <div className='w-full overflow-hidden rounded border border-accent drop-shadow-primary'>
                <div className='flex min-h-[24px] w-full items-center justify-center bg-primary-hue-purple'>
                  <span className='px-5 py-0.5 text-lg font-medium uppercase text-white'>
                    {formattedUpcomingDate}
                  </span>
                </div>
                <div className='flex flex-col bg-white px-2.5 py-0.5'>
                  <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
                  <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
                  <BaseChip iconName='hourglass'>{scheduleDuration}</BaseChip>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
