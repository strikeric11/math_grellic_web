import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { convertSecondsToDuration, getDayJsDuration } from '#/utils/time.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { ScheduleType } from '../models/schedule.model';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { ExamSchedule } from '#/exam/models/exam.model';
import type { LessonSchedule } from '#/lesson/models/lesson.model';
import type { MeetingSchedule } from '../models/schedule.model';

type Props = ComponentProps<'div'> & {
  schedule: LessonSchedule | ExamSchedule | MeetingSchedule | null;
  scheduleEmptyLabel?: string;
  isStudent?: boolean;
  fixedWidth?: boolean;
};

const TIME_CLASSNAME =
  'flex h-[26px] w-[76px] items-center justify-center rounded border border-accent bg-white text-sm text-accent';

const TIME_LINE_CLASSNAME = 'h-px w-[18px] bg-accent';

export const ScheduleDailyCard = memo(function ({
  className,
  schedule,
  isStudent,
  fixedWidth,
  scheduleEmptyLabel = 'No schedule on this day',
}: Props) {
  const scheduleType = useMemo(() => {
    if (!schedule) {
      return null;
    }

    const value = schedule || {};

    if (ScheduleType.Lesson in value) {
      return ScheduleType.Lesson;
    } else if (ScheduleType.Exam in value) {
      return ScheduleType.Exam;
    } else if (ScheduleType.Meeting in value) {
      return ScheduleType.Meeting;
    }
  }, [schedule]);

  const to = useMemo(() => {
    if (!schedule) {
      return '';
    }

    if (scheduleType === ScheduleType.Lesson) {
      const basePath = isStudent
        ? `/${studentBaseRoute}/${studentRoutes.lesson.to}`
        : `/${teacherBaseRoute}/${teacherRoutes.lesson.to}`;

      return `${basePath}/${(schedule as LessonSchedule).lesson.slug}`;
    } else if (scheduleType === ScheduleType.Exam) {
      const basePath = isStudent
        ? `/${studentBaseRoute}/${studentRoutes.exam.to}`
        : `/${teacherBaseRoute}/${teacherRoutes.exam.to}`;

      return `${basePath}/${(schedule as ExamSchedule).exam.slug}`;
    } else {
      const basePath = isStudent
        ? `/${studentBaseRoute}/${studentRoutes.schedule.to}/${teacherRoutes.schedule.meeting.to}`
        : `/${teacherBaseRoute}/${teacherRoutes.schedule.to}/${teacherRoutes.schedule.meeting.to}`;

      return `${basePath}/${(schedule as MeetingSchedule).id}`;
    }
  }, [scheduleType, schedule, isStudent]);

  const iconName = useMemo(() => {
    if (!scheduleType) {
      return null;
    }

    if (scheduleType === ScheduleType.Lesson) {
      return 'chalkboard-teacher';
    } else if (scheduleType === ScheduleType.Exam) {
      return 'exam';
    } else {
      return 'presentation';
    }
  }, [scheduleType]);

  const orderNumberComponent = useMemo(() => {
    if (scheduleType === ScheduleType.Meeting || !schedule) {
      return null;
    }

    const iconName =
      scheduleType === ScheduleType.Lesson ? 'chalkboard-teacher' : 'exam';

    const orderNumber =
      scheduleType === ScheduleType.Lesson
        ? `Lesson ${(schedule as any).lesson.orderNumber}`
        : `Exam ${(schedule as any).exam.orderNumber}`;

    return <BaseChip iconName={iconName}>{orderNumber}</BaseChip>;
  }, [scheduleType, schedule]);

  const duration = useMemo(() => {
    if (!schedule) {
      return null;
    }

    if (scheduleType === ScheduleType.Lesson) {
      return convertSecondsToDuration(
        (schedule as any).lesson.durationSeconds || 0,
        true,
      );
    } else {
      const { startDate, endDate } = schedule as ExamSchedule | MeetingSchedule;
      const duration = getDayJsDuration(endDate, startDate).asSeconds();
      return convertSecondsToDuration(duration);
    }
  }, [scheduleType, schedule]);

  const title = useMemo(() => {
    if (!schedule) {
      return null;
    }

    if (scheduleType === ScheduleType.Lesson) {
      return (schedule as LessonSchedule).lesson.title;
    } else if (scheduleType === ScheduleType.Exam) {
      return (schedule as ExamSchedule).exam.title;
    } else {
      return (schedule as MeetingSchedule).title;
    }
  }, [scheduleType, schedule]);

  const startTime = useMemo(() => {
    if (!schedule) {
      return null;
    }

    return `${dayjs(schedule.startDate).format('hh:mm A')}`;
  }, [schedule]);

  const endTime = useMemo(() => {
    if (scheduleType === ScheduleType.Lesson || !schedule) {
      return null;
    }

    return `${dayjs(
      (schedule as ExamSchedule | MeetingSchedule).endDate,
    ).format('hh:mm A')}`;
  }, [scheduleType, schedule]);

  return (
    <Link
      to={to}
      className={cx(!scheduleType ? 'pointer-events-none' : 'group')}
    >
      <div className={cx('relative animate-fastFadeIn', className)}>
        {(!scheduleType || startTime) && (
          <div className='absolute right-full top-2.5 flex items-center'>
            <div
              className={cx(
                TIME_CLASSNAME,
                !scheduleType && '!border-accent/30 !bg-accent/10',
              )}
            >
              {startTime}
            </div>
            <div
              className={cx(
                TIME_LINE_CLASSNAME,
                !scheduleType && '!bg-accent/30',
              )}
            />
          </div>
        )}
        {endTime && (
          <div className='absolute bottom-2.5 right-full flex items-center'>
            <div className={TIME_CLASSNAME}>{endTime}</div>
            <div className={TIME_LINE_CLASSNAME} />
          </div>
        )}
        <div
          className={cx(
            'relative z-10 flex h-[234px] flex-col gap-2.5 rounded-lg border p-2.5 transition-all group-hover:-translate-y-1 group-hover:ring-1 group-hover:drop-shadow-primary',
            fixedWidth ? '-2lg:w-[300px] w-full' : 'w-full',
            !scheduleType
              ? 'items-center justify-center border-accent/30 bg-accent/10 text-accent'
              : 'border-accent text-white',
            scheduleType === ScheduleType.Lesson &&
              'bg-primary group-hover:border-primary-focus group-hover:ring-primary-focus',
            scheduleType === ScheduleType.Exam &&
              'bg-primary-hue-purple group-hover:border-primary-hue-purple-focus group-hover:ring-primary-hue-purple-focus',
            scheduleType === ScheduleType.Meeting &&
              'bg-primary-hue-orange group-hover:border-primary-hue-orange-focus group-hover:ring-primary-hue-orange-focus',
          )}
        >
          {scheduleType ? (
            <>
              <div className='flex h-[124px] w-full shrink-0 items-center justify-center rounded border border-accent bg-white/50 text-accent'>
                {iconName && (
                  <BaseIcon
                    name={iconName as IconName}
                    size={40}
                    weight='light'
                  />
                )}
              </div>
              <div className='flex w-full items-center justify-between opacity-90'>
                {orderNumberComponent}
                <BaseChip iconName='hourglass'>{duration}</BaseChip>
              </div>
              <h4 className='font-body text-lg font-medium leading-tight !tracking-normal !text-white'>
                {title}
              </h4>
            </>
          ) : (
            scheduleEmptyLabel
          )}
        </div>
      </div>
    </Link>
  );
});
