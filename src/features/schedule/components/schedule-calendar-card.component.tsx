import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseIcon } from '#/base/components/base-icon.component';
import { ScheduleType } from '../models/schedule.model';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { ExamSchedule } from '#/exam/models/exam.model';
import type { LessonSchedule } from '#/lesson/models/lesson.model';
import type {
  MeetingSchedule,
  ScheduleCard as ScheduleCardType,
} from '../models/schedule.model';

type Props = ComponentProps<'button'> & {
  schedule: ScheduleCardType;
  isCompact?: boolean;
};

export const ScheduleCalendarCard = memo(function ({
  className,
  schedule,
  isCompact,
  disabled,
  ...moreProps
}: Props) {
  const [type, isStart, isEnd] = useMemo(
    () => [schedule.type, schedule.isStart, schedule.isEnd],
    [schedule],
  );

  const iconName: IconName | null = useMemo(() => {
    switch (type) {
      case ScheduleType.Lesson:
        return 'chalkboard-teacher';
      case ScheduleType.Exam:
        return 'exam';
      default:
        return 'presentation';
    }
  }, [type]);

  const title = useMemo(() => {
    if (schedule.type === ScheduleType.Lesson) {
      const orderNumber = (schedule as LessonSchedule).lesson.orderNumber
        .toString()
        .padStart(2, '0');

      return isCompact ? orderNumber : `Lesson ${orderNumber}`;
    } else if (schedule.type === ScheduleType.Exam) {
      const orderNumber = (schedule as ExamSchedule).exam.orderNumber
        .toString()
        .padStart(2, '0');

      return isCompact ? orderNumber : `Exam ${orderNumber}`;
    } else {
      return isCompact ? '' : 'Meeting';
    }
  }, [schedule, isCompact]);

  const time = useMemo(() => {
    if (schedule.type === ScheduleType.Lesson) {
      return dayjs(schedule.startDate).format('HH:mm');
    }

    const startTime = dayjs(schedule.startDate).format('HH:mm');
    const endTime = dayjs(
      (schedule as ExamSchedule | MeetingSchedule).endDate,
    ).format('HH:mm');

    return `${startTime} - ${endTime}`;
  }, [schedule]);

  return (
    <button
      className={cx(
        'relative h-full w-full rounded bg-primary',
        type === ScheduleType.Exam && '!bg-primary-hue-purple',
        type === ScheduleType.Meeting && '!bg-primary-hue-orange',
        disabled && 'pointer-events-none',
        className,
      )}
      disabled={disabled}
      {...moreProps}
    >
      {!isStart && (
        <div
          className={cx(
            'absolute -top-3 left-0 h-4 w-full bg-primary',
            type === ScheduleType.Exam && '!bg-primary-hue-purple',
            type === ScheduleType.Meeting && '!bg-primary-hue-orange',
          )}
        />
      )}
      <div
        className={cx(
          'flex h-full w-full items-start justify-start overflow-hidden p-1 text-left uppercase text-white',
          isStart && isEnd && 'flex-col !justify-between',
          !isStart && isEnd && '!items-end',
        )}
      >
        {isStart && (
          <div className='flex items-center gap-x-1'>
            {iconName && <BaseIcon name={iconName} size={20} />}
            <span className='text-sm'>{title}</span>
          </div>
        )}
        {isEnd && <div className='text-sm'>{time}</div>}
      </div>
    </button>
  );
});
