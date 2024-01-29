import { memo } from 'react';
import cx from 'classix';

import { BaseDivider } from '#/base/components/base-divider.component';
import { useClock } from '../hooks/use-clock.hook';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & { isCompact?: boolean };

export const CoreClock = memo(function ({
  className,
  isCompact,
  ...moreProps
}: Props) {
  const { loading, time, date, dayName } = useClock();

  return (
    !loading && (
      <div
        className={cx(
          'flex items-center gap-2.5 transition-[gap]',
          isCompact && '!gap-0',
          className,
        )}
        {...moreProps}
      >
        <div className='flex w-16 justify-center text-sm font-medium uppercase leading-none text-primary lg:w-[75px] lg:text-base'>
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
            'flex w-24 flex-col items-start overflow-hidden whitespace-nowrap text-sm font-medium uppercase leading-none text-primary opacity-100 transition-[width,opacity] duration-300 lg:w-[104px] lg:text-base',
            isCompact && '!w-0 !opacity-0',
          )}
        >
          <span>{dayName}</span>
          <span>{date}</span>
        </div>
      </div>
    )
  );
});
