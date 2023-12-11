import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { DAYS_PER_WEEK } from '#/utils/time.util';

import type { ComponentProps } from 'react';
import type { Dayjs } from 'dayjs';
import type { TimelineSchedules } from '../models/schedule.model';

type Props = Omit<ComponentProps<'div'>, 'onChange'> & {
  loading: boolean;
  currentDate: Date;
  today: Date;
  weekIndex?: number;
  dateRowClassName?: string;
  timelineSchedules?: TimelineSchedules;
  onChange?: (date: Date) => void;
};

type SchedulesIndicatorProps = {
  date: Dayjs;
  timelineSchedules: TimelineSchedules;
};

const SchedulesIndicator = memo(function ({
  date,
  timelineSchedules,
}: SchedulesIndicatorProps) {
  const [lessonSchedules, examSchedules, meetingSchedules] = useMemo(
    () => [
      timelineSchedules.lessonSchedules.filter((s) =>
        dayjs(s.startDate).isSame(date, 'day'),
      ),
      timelineSchedules.examSchedules.filter((s) =>
        dayjs(s.startDate).isSame(date, 'day'),
      ),
      timelineSchedules.meetingSchedules.filter((s) =>
        dayjs(s.startDate).isSame(date, 'day'),
      ),
    ],
    [date, timelineSchedules],
  );

  return (
    <div className='absolute bottom-0.5 flex w-full items-center justify-center gap-0.5'>
      {lessonSchedules.map((schedule) => (
        <div
          key={`ls-${schedule.id}`}
          className='h-2.5 w-2.5 overflow-hidden rounded-full bg-primary'
        />
      ))}
      {examSchedules.map((schedule) => (
        <div
          key={`ls-${schedule.id}`}
          className='h-2.5 w-2.5 overflow-hidden rounded-full bg-primary-hue-purple'
        />
      ))}
      {meetingSchedules.map((schedule) => (
        <div
          key={`ls-${schedule.id}`}
          className='h-2.5 w-2.5 overflow-hidden rounded-full bg-primary-hue-orange'
        />
      ))}
    </div>
  );
});

export const ScheduleCalendar = memo(function ({
  className,
  loading,
  currentDate = new Date(),
  today,
  weekIndex = 0,
  dateRowClassName,
  timelineSchedules,
  onChange,
  ...moreProps
}: Props) {
  const selectedWeekFirstDay = useMemo(
    () => dayjs(today).weekday(DAYS_PER_WEEK * weekIndex),
    [weekIndex, today],
  );

  const rows = useMemo(() => {
    const cells = getCalendarCells(dayjs(currentDate));
    const rows = [];

    // Split one array into chunks
    for (let i = 0; i < cells.length; i += 7) {
      const targetCells = cells.slice(i, i + 7);

      const isSelectedWeek = selectedWeekFirstDay.isBetween(
        targetCells[0].value,
        targetCells[targetCells.length - 1].value,
        'day',
        '[]',
      );

      rows.push({ cells: targetCells, isSelectedWeek });
    }

    return rows;
  }, [currentDate, selectedWeekFirstDay]);

  const handleDateChange = useCallback(
    (date: Dayjs) => () => {
      if (!onChange) {
        return;
      }

      !!onChange && onChange(date.toDate());
    },
    [onChange],
  );

  return (
    <div className={cx('flex w-full flex-col', className)} {...moreProps}>
      <div className='flex w-full items-center'>
        {rows[0].cells.map(({ value }, index) => (
          <div
            key={`rh-${index}`}
            className='flex h-10 w-full items-center justify-center border-r border-primary-border-light text-sm last:border-transparent'
          >
            {value.format('dd')}
          </div>
        ))}
      </div>
      <div className='flex w-full flex-1 flex-col'>
        {rows.map(({ cells, isSelectedWeek }, rowIndex) => (
          <div
            key={`r-${rowIndex}`}
            className={cx(
              'group/row relative flex w-full flex-1 items-center',
              !loading &&
                !isSelectedWeek &&
                'hover:!border-primary-focus-light hover:bg-backdrop-light hover:text-primary-focus-light',
              dateRowClassName,
            )}
          >
            {cells.map(({ text, value, isPresent }, index) => (
              <button
                key={`c-${value}-${index}`}
                type='button'
                className={cx(
                  `h-12 w-full border border-b-primary-border-light border-l-transparent border-r-primary-border-light border-t-transparent p-[3px] text-sm transition-transform
                    last:border-r-transparent group-first/row:border-t-primary-border-light group-last/row:border-b-transparent`,
                  !isPresent && 'text-accent/70',
                  value.isSame(today, 'day') &&
                    '!rounded-sm !border-primary/40 !bg-primary/40',
                )}
                disabled={loading}
                onClick={handleDateChange(value)}
              >
                <div
                  className={cx(
                    'relative flex h-full w-full items-center justify-center',
                    value.isSame(today, 'day') && 'rounded-md bg-white',
                  )}
                >
                  <span>{text}</span>
                  {timelineSchedules && (
                    <SchedulesIndicator
                      date={value}
                      timelineSchedules={timelineSchedules}
                    />
                  )}
                </div>
              </button>
            ))}
            {isSelectedWeek && (
              <div className='absolute left-0 top-0 h-full w-full border-[3px] border-primary' />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

function prepareCell(date: Dayjs, dayNum: number, isPresent?: boolean) {
  return {
    text: dayNum.toString().padStart(2, '0'),
    value: date.clone().set('date', dayNum),
    isPresent,
  };
}

function getCalendarCells(date: Dayjs) {
  const calendarCells = [];
  const daysInMonth = date.daysInMonth();
  const prevMonth = date.subtract(1, 'month');
  const nextMonth = date.add(1, 'month');

  // Push previous month day cells
  const startDayIndex = date.startOf('month').day();
  for (let i = startDayIndex - 1; i >= 1; i--) {
    calendarCells.push(
      prepareCell(prevMonth, prevMonth.daysInMonth() - (i - 1)),
    );
  }

  // Push current month day cells
  for (let i = 0; i < daysInMonth; i++) {
    calendarCells.push(prepareCell(date, i + 1, true));
  }

  // Push next month day cells
  const cellsLeft = 35 - calendarCells.length;
  const cellsNeeded = cellsLeft > 0 ? cellsLeft : 7 - Math.abs(cellsLeft);
  for (let i = 0; i < cellsNeeded; i++) {
    calendarCells.push(prepareCell(nextMonth, i + 1));
  }

  return calendarCells;
}
