import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';

import type { ComponentProps } from 'react';
import type { Dayjs } from 'dayjs';

type Props = Omit<ComponentProps<'div'>, 'onChange'> & {
  currentDate: Date;
  selectedDate?: string;
  dateRowClassName?: string;
  onChange?: (date: Date) => void;
};

export const BaseCalendar = memo(function ({
  className,
  currentDate = new Date(),
  selectedDate,
  dateRowClassName,
  onChange,
  ...moreProps
}: Props) {
  const rows = useMemo(() => {
    const cells = getCalendarCells(dayjs(currentDate));
    const rows = [];

    // Split one array into chunks
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }

    return rows;
  }, [currentDate]);

  const handleDateChange = useCallback(
    (date: Dayjs) => () => !!onChange && onChange(date.toDate()),
    [onChange],
  );

  return (
    <div className={cx('flex w-full flex-col', className)} {...moreProps}>
      <div className='flex w-full items-center'>
        {rows[0].map(({ value }, index) => (
          <div
            key={`rh-${index}`}
            className='flex h-10 w-full items-center justify-center border-r border-primary-border-light text-sm last:border-transparent'
          >
            {value.format('dd')}
          </div>
        ))}
      </div>
      <div className='flex w-full flex-1 flex-col'>
        {rows.map((cells, rowIndex) => (
          <div
            key={`r-${rowIndex}`}
            className={cx(
              'group/row flex w-full flex-1 items-center',
              dateRowClassName,
            )}
          >
            {cells.map(({ text, value, isPresent }, index) => (
              <button
                key={`c-${value}-${index}`}
                type='button'
                className={cx(
                  `h-full w-full border border-b-primary-border-light border-l-transparent border-r-primary-border-light border-t-transparent p-[3px] text-sm transition-transform
                    last:border-r-transparent hover:!border-primary-focus-light hover:bg-backdrop-light hover:text-primary-focus-light active:scale-90 group-first/row:border-t-primary-border-light group-last/row:border-b-transparent`,
                  !isPresent && 'text-accent/70',
                  !!selectedDate &&
                    value.isSame(dayjs(selectedDate), 'day') &&
                    '!rounded-sm !border-primary !bg-primary',
                )}
                onClick={handleDateChange(value)}
              >
                <div
                  className={cx(
                    'flex h-full w-full items-center justify-center',
                    !!selectedDate &&
                      value.isSame(dayjs(selectedDate), 'day') &&
                      'rounded-md bg-backdrop-light',
                  )}
                >
                  {text}
                </div>
              </button>
            ))}
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
