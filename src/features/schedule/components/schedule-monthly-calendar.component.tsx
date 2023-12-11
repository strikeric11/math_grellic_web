import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseCalendarSelector } from '#/base/components/base-calendar-selector.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { ScheduleCalendar } from './schedule-calendar.component';

import type { ComponentProps } from 'react';
import type { TimelineSchedules } from '../models/schedule.model';

type Props = ComponentProps<'div'> & {
  loading: boolean;
  today: Date;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  timelineSchedules?: TimelineSchedules;
  weekIndex?: number;
  onWeekChange?: (value: number) => void;
};

export const ScheduleMonthlyCalendar = memo(function ({
  className,
  loading,
  today,
  currentDate,
  weekIndex,
  timelineSchedules,
  onDateChange,
  onWeekChange,
  ...moreProps
}: Props) {
  const minDate = useMemo(() => {
    const date = dayjs(dayjs(today).format('YYYY[-01-01]')).toDate();

    return dayjs(date)
      .set('year', date.getFullYear() - 2)
      .toDate();
  }, [today]);

  const maxDate = useMemo(() => {
    const date = dayjs(dayjs(today).format('YYYY[-12-31]')).toDate();

    return dayjs(date)
      .set('year', date.getFullYear() + 2)
      .toDate();
  }, [today]);

  const handleWeekChange = useCallback(
    (date: Date) => {
      if (!onWeekChange || weekIndex == null) {
        return;
      }

      const targetDateText = dayjs(date).format('YYYY-MM-DD');
      const todayDateText = dayjs(today).format('YYYY-MM-DD');
      const value = dayjs(targetDateText)
        .weekday(0)
        .diff(dayjs(todayDateText).weekday(0), 'week');

      onWeekChange(value - weekIndex);
    },
    [today, weekIndex, onWeekChange],
  );

  return (
    <div
      className={cx('flex w-full flex-col gap-y-2.5', className)}
      {...moreProps}
    >
      <h2 className='text-lg'>Monthly Calendar</h2>
      <BaseSurface className='!p-0' rounded='xs'>
        <BaseCalendarSelector
          currentDate={currentDate}
          minDate={minDate}
          maxDate={maxDate}
          onChange={onDateChange}
        />
      </BaseSurface>
      <BaseSurface className='relative !p-0' rounded='xs'>
        {loading && (
          <div className='absolute z-10 flex h-full w-full items-center justify-center rounded-md bg-accent/10'>
            <BaseSpinner />
          </div>
        )}
        <ScheduleCalendar
          loading={loading}
          currentDate={currentDate}
          today={today}
          weekIndex={weekIndex}
          timelineSchedules={timelineSchedules}
          onChange={handleWeekChange}
        />
      </BaseSurface>
    </div>
  );
});
