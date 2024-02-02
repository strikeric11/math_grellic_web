import { memo, useCallback, useMemo, useState } from 'react';
import cx from 'classix';

import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { ScheduleDailyCard } from './schedule-daily-card.component';

import type { ComponentProps } from 'react';
import type { ExamSchedule } from '#/exam/models/exam.model';
import type { LessonSchedule } from '#/lesson/models/lesson.model';
import type { MeetingSchedule } from '../models/schedule.model';

type Props = ComponentProps<'div'> & {
  schedules: (LessonSchedule | ExamSchedule | MeetingSchedule)[];
  scheduleTo: string;
  scheduleEmptyLabel?: string;
  scheduleCardWrapperClassName?: string;
  loading?: boolean;
  isStudent?: boolean;
  fixedWidth?: boolean;
};

export const ScheduleDailyCardList = memo(function ({
  loading,
  schedules,
  scheduleTo,
  scheduleEmptyLabel,
  scheduleCardWrapperClassName,
  isStudent,
  fixedWidth,
  ...moreProps
}: Props) {
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);

  const currentSchedule = useMemo(
    () => (!schedules.length ? null : schedules[currentScheduleIndex]),
    [currentScheduleIndex, schedules],
  );

  const handleChange = useCallback(
    (isNext: boolean) => () => {
      if (
        (isNext && currentScheduleIndex >= schedules.length - 1) ||
        (!isNext && currentScheduleIndex <= 0)
      ) {
        return;
      }

      setCurrentScheduleIndex(
        isNext ? currentScheduleIndex + 1 : currentScheduleIndex - 1,
      );
    },
    [currentScheduleIndex, schedules],
  );

  const handleSetIndex = useCallback(
    (index: number) => () => setCurrentScheduleIndex(index),
    [],
  );

  return (
    <div {...moreProps}>
      <div className='flex items-stretch border-b border-b-accent/20'>
        <div className='flex w-[84px] shrink-0 flex-col items-center justify-center border-r border-r-accent/20'>
          {schedules.map((_, index) => (
            <button
              key={`s-${index}`}
              className='flex items-center justify-center p-[3px]'
              onClick={handleSetIndex(index)}
            >
              <div
                className={cx(
                  'h-2.5 w-2.5 overflow-hidden rounded-full',
                  index === currentScheduleIndex
                    ? 'bg-primary'
                    : 'bg-primary/30',
                )}
              />
            </button>
          ))}
        </div>
        <div
          className={cx('w-full px-2.5 pb-2.5', scheduleCardWrapperClassName)}
        >
          {loading ? (
            <div
              className={cx(
                'flex h-[234px] items-center justify-center',
                fixedWidth ? 'w-full -2lg:w-[300px]' : 'w-full',
              )}
            >
              <BaseSpinner />
            </div>
          ) : (
            <ScheduleDailyCard
              schedule={currentSchedule}
              scheduleEmptyLabel={scheduleEmptyLabel}
              isStudent={isStudent}
              fixedWidth={fixedWidth}
            />
          )}
        </div>
      </div>
      <div className='flex items-stretch'>
        <div className='flex h-8 w-[84px] items-center justify-center overflow-hidden border-r border-r-accent/20 pt-2'>
          <BaseIconButton
            name='caret-circle-up'
            variant='link'
            className='w-9'
            disabled={loading || !currentSchedule}
            onClick={handleChange(false)}
          />
          <BaseIconButton
            name='caret-circle-down'
            variant='link'
            className='w-9'
            disabled={loading || !currentSchedule}
            onClick={handleChange(true)}
          />
        </div>
        <div className='flex flex-1 items-center justify-center pt-1.5'>
          <BaseLink
            to={scheduleTo}
            rightIconName='arrow-circle-right'
            size='xs'
          >
            View All Schedule
          </BaseLink>
        </div>
      </div>
    </div>
  );
});
