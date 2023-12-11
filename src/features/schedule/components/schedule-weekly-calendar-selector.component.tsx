import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { generateOrdinalSuffix } from '#/utils/string.util';
import { DAYS_PER_WEEK } from '#/utils/time.util';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseDivider } from '#/base/components/base-divider.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  loading: boolean;
  today: Date;
  weekIndex: number;
  onWeekChange: (value: number) => void;
  onRefresh: () => void;
};

export const ScheduleWeeklyCalendarSelector = memo(function ({
  className,
  loading,
  today,
  weekIndex,
  onWeekChange,
  onRefresh,
  ...moreProps
}: Props) {
  const [firstDay, lastDay] = useMemo(() => {
    const value = DAYS_PER_WEEK * weekIndex;
    return [
      dayjs(today).weekday(value),
      dayjs(today).weekday(DAYS_PER_WEEK - 1 + value),
    ];
  }, [weekIndex, today]);

  const label = useMemo(() => {
    const firstDayOrdinal = generateOrdinalSuffix(firstDay.date());
    const lastDayOrdinal = generateOrdinalSuffix(lastDay.date());

    if (firstDay.month() === lastDay.month()) {
      return `${firstDayOrdinal} — ${lastDayOrdinal} of ${lastDay.format(
        'MMMM',
      )} ${lastDay.year()}`;
    } else if (firstDay.year() === lastDay.year()) {
      const firstDayLabel = `${firstDayOrdinal} of ${firstDay.format('MMMM')}`;
      const lastDayLabel = `${lastDayOrdinal} of ${lastDay.format('MMMM')}`;

      return `${firstDayLabel} — ${lastDayLabel} ${lastDay.year()}`;
    }

    const firstDayLabel = `${firstDayOrdinal} of ${firstDay.format(
      'MMMM',
    )} ${firstDay.year()}`;

    const lastDayLabel = `${lastDayOrdinal} of ${lastDay.format(
      'MMMM',
    )} ${lastDay.year()}`;

    return `${firstDayLabel} — ${lastDayLabel}`;
  }, [firstDay, lastDay]);

  const handleChange = useCallback(
    (isNext: boolean) => () => {
      const valueToAdd = isNext ? 1 : -1;
      onWeekChange(valueToAdd);
    },
    [onWeekChange],
  );

  return (
    <div
      className={cx(
        'flex w-full items-center justify-between px-2.5',
        className,
      )}
      {...moreProps}
    >
      <div>{label}</div>
      <div className='flex w-fit items-center'>
        <BaseIconButton
          name='arrow-clockwise'
          variant='link'
          size='sm'
          disabled={loading}
          onClick={onRefresh}
        />
        <BaseDivider className='!mx-2 !h-6' vertical />
        <BaseIconButton
          name='caret-circle-left'
          variant='link'
          className='w-9'
          disabled={loading}
          onClick={handleChange(false)}
        />
        <BaseIconButton
          name='caret-circle-right'
          variant='link'
          className='w-9'
          disabled={loading}
          onClick={handleChange(true)}
        />
      </div>
    </div>
  );
});
