import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classix';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { motion } from 'framer-motion';

import dayjs from '#/config/dayjs.config';
import { BaseDropdownButton } from './base-dropdown-button.component';
import { BaseIconButton } from './base-icon-button.component';
import { BaseButton } from './base-button.components';

import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<'div'>, 'onChange'> & {
  currentDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  isExpanded?: boolean;
  onExpand?: (isExpand: boolean) => void;
  onChange?: (date: Date) => void;
};

const widthAnimation = {
  initial: { width: '0%' },
  animate: { width: '100%' },
};

export const BaseCalendarSelector = memo(function ({
  className,
  currentDate = new Date(),
  minDate = new Date('01-01-1900'),
  maxDate = new Date(),
  isExpanded,
  onExpand,
  onChange,
  ...moreProps
}: Props) {
  const [currentYear, setCurrentYear] = useState<number | undefined>(undefined);

  const date = useMemo(
    () => dayjs(currentDate).format('MMMM YYYY'),
    [currentDate],
  );

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const currentYearId = `year-${currentDate.getFullYear()}`;
    const element = document.getElementById(currentYearId);
    !!element && element.scrollIntoView({ block: 'nearest' });
  }, [isExpanded, currentDate]);

  // Generate years from min and max date
  const years = useMemo(() => {
    const list = [];
    let i = minDate.getFullYear();
    const maxYear = maxDate.getFullYear();

    while (i <= maxYear) {
      list.push(i);
      ++i;
    }
    return list;
  }, [minDate, maxDate]);

  const months = useMemo(() => {
    if (!currentYear) {
      return [];
    }

    const isMaxYear = maxDate.getFullYear() === currentYear;
    const maxMonthIndex = maxDate.getMonth();

    return dayjs.months().map((m, i) => ({
      value: i + 1,
      label: m,
      disabled: isMaxYear && i > maxMonthIndex,
    }));
  }, [currentYear, maxDate]);

  const changeCurrentDate = useCallback(
    (date: Date) => {
      // If selected month and year is over max date then cancel
      if (dayjs(date).isAfter(maxDate, 'month')) {
        return;
      }

      !!onChange && onChange(date);
      !!onExpand && onExpand(false);
    },
    [maxDate, onChange, onExpand],
  );

  const handleSetCurrentYear = useCallback(
    (year: number) => () => setCurrentYear(year),
    [],
  );

  const handleExpand = useCallback(
    () => !!onExpand && onExpand(!isExpanded),
    [isExpanded, onExpand],
  );

  const handleChange = useCallback(
    (isNext: boolean) => () => {
      // Add or subtract a month from current date
      const date = isNext
        ? dayjs(currentDate).add(1, 'month')
        : dayjs(currentDate).subtract(1, 'month');

      if (isNext ? date.isAfter(maxDate) : date.isBefore(minDate)) {
        return;
      }

      changeCurrentDate(date.toDate());
    },
    [maxDate, minDate, currentDate, changeCurrentDate],
  );

  const handleSpecificChange = useCallback(
    (month: number) => () => {
      const date = dayjs(`${currentYear}-${month}-02`).toDate();
      changeCurrentDate(date);
      setCurrentYear(undefined);
    },
    [currentYear, changeCurrentDate],
  );

  return (
    <div className={cx('flex w-full flex-col', className)} {...moreProps}>
      <div className='flex w-full items-center justify-between px-2.5'>
        <BaseButton
          className={cx(
            '!font-body !text-base !font-medium !tracking-normal',
            !onExpand &&
              '!text-accent hover:!cursor-default hover:!text-accent active:!scale-100',
          )}
          variant='link'
          size='sm'
          leftIconName='calendar'
          onClick={handleExpand}
        >
          {date}
        </BaseButton>
        <div className='flex w-fit items-center'>
          <BaseIconButton
            name='caret-circle-left'
            variant='link'
            className='w-9'
            onClick={handleChange(false)}
          />
          <BaseIconButton
            name='caret-circle-right'
            variant='link'
            className='w-9'
            onClick={handleChange(true)}
          />
        </div>
      </div>
      {isExpanded && (
        <div className='flex h-[302px] w-full items-start overflow-hidden border-t border-t-primary-border-light'>
          <div className='h-full w-full'>
            <OverlayScrollbarsComponent className='h-full w-full p-2.5' defer>
              {years.map((y) => (
                <BaseDropdownButton
                  key={y}
                  type='button'
                  id={`year-${y}`}
                  className='items-center'
                  selected={y === currentYear}
                  onClick={handleSetCurrentYear(y)}
                  center
                >
                  {y}
                </BaseDropdownButton>
              ))}
            </OverlayScrollbarsComponent>
          </div>
          {currentYear !== undefined && (
            <motion.div className='h-full w-full' {...widthAnimation}>
              <OverlayScrollbarsComponent
                className='h-full w-full border-l border-l-primary-border-light p-2.5'
                defer
              >
                {months.map(({ label, value, disabled }) => (
                  <BaseDropdownButton
                    key={value}
                    type='button'
                    className='items-center'
                    disabled={disabled}
                    onClick={handleSpecificChange(value)}
                    center
                  >
                    {label}
                  </BaseDropdownButton>
                ))}
              </OverlayScrollbarsComponent>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
});
