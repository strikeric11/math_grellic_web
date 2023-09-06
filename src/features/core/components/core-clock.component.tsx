import { memo, useMemo } from 'react';
import dayjs from 'dayjs';
import cx from 'classix';

import { BaseDivider } from '#/base/components/base-divider.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & { dateTime: Date; isCompact?: boolean };

export const CoreClock = memo(function ({
  className,
  dateTime,
  isCompact,
  ...moreProps
}: Props) {
  const time = useMemo(() => dayjs(dateTime).format('hh:mm A'), [dateTime]);
  const date = useMemo(
    () => dayjs(dateTime).format('MMM DD, YYYY'),
    [dateTime],
  );
  const dayName = useMemo(() => dayjs(dateTime).format('dddd'), [dateTime]);

  return (
    <div
      className={cx(
        'flex items-center gap-2.5 transition-[gap]',
        isCompact && '!gap-0',
        className,
      )}
      {...moreProps}
    >
      {/* TODO MAKE CLOCK REALTIME */}
      <div className='font-medium uppercase leading-none text-primary'>
        {time}
      </div>
      <div
        className={cx(
          'h-full opacity-100 transition-opacity duration-300',
          isCompact && '!opacity-0',
        )}
      >
        <BaseDivider vertical />
      </div>
      <div
        className={cx(
          'flex w-[104px] flex-col items-start overflow-hidden whitespace-nowrap font-medium uppercase leading-none text-primary opacity-100 transition-[width,opacity] duration-300',
          isCompact && '!w-0 !opacity-0',
        )}
      >
        <span>{dayName}</span>
        <span>{date}</span>
      </div>
    </div>
  );
});
