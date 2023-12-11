import { Fragment, memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { DAYS_PER_WEEK, generateTimelineHours } from '#/utils/time.util';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { ScheduleType } from '../models/schedule.model';
import { ScheduleCalendarCard } from './schedule-calendar-card.component';

import type { ComponentProps } from 'react';
import type { ExamSchedule } from '#/exam/models/exam.model';
import type {
  MeetingSchedule,
  ScheduleCard as ScheduleCardType,
  TimelineSchedules,
} from '../models/schedule.model';

type Props = ComponentProps<'div'> & {
  loading: boolean;
  today: Date;
  weekIndex: number;
  timelineSchedules?: TimelineSchedules;
  onScheduleClick?: (schedule: ScheduleCardType) => void;
};

const DEFAULT_MIN_HOUR = 7;
const DEFAULT_MAX_HOUR = 17;

const defaultTimelineSchedules = {
  lessonSchedules: [],
  examSchedules: [],
  meetingSchedules: [],
};

function generateSchedulesByHour(schedulesByDay: any, hour: number): any[] {
  return schedulesByDay
    .filter((schedule: any) =>
      schedule.type === ScheduleType.Lesson
        ? dayjs(schedule.startDate).hour() === hour
        : dayjs(schedule.startDate).hour() <= hour &&
          dayjs((schedule as ExamSchedule | MeetingSchedule).endDate).hour() >=
            hour,
    )
    .map((schedule: any) => {
      let isStart = false;
      let isEnd = false;

      if (schedule.type === ScheduleType.Lesson) {
        isStart = true;
        isEnd = true;
      } else {
        if (dayjs(schedule.startDate).hour() === hour) {
          isStart = true;
        }

        if (
          dayjs((schedule as ExamSchedule | MeetingSchedule).endDate).hour() ===
          hour
        ) {
          isEnd = true;
        }
      }

      return { ...schedule, isStart, isEnd };
    });
}

export const ScheduleWeeklyCalendar = memo(function ({
  className,
  loading,
  today,
  weekIndex,
  timelineSchedules = defaultTimelineSchedules,
  onScheduleClick,
  ...moreProps
}: Props) {
  const dates = useMemo(() => {
    const value = weekIndex * DAYS_PER_WEEK;
    return [...Array(DAYS_PER_WEEK)].map((_, index) =>
      dayjs(today).weekday(index + value),
    );
  }, [weekIndex, today]);

  const hours = useMemo(() => {
    // Convert timelineSchedules into a single array of hours and sort schedules by startDate
    const scheduleHours = Object.values(timelineSchedules)
      .flat()
      .map((schedule) => +dayjs(schedule.startDate).format('H.mm'))
      .sort((timeA, timeB) => (timeA <= timeB ? -1 : 1));

    const scheduleEndHours = Object.values(timelineSchedules)
      .flat()
      .filter((schedule) => (schedule as any)['endDate'] != null)
      .map(
        (schedule) =>
          +dayjs((schedule as MeetingSchedule | ExamSchedule).endDate).format(
            'H.mm',
          ),
      )
      .sort((timeA, timeB) => (timeA >= timeB ? -1 : 1));

    let min = DEFAULT_MIN_HOUR;
    let max = DEFAULT_MAX_HOUR;

    if (scheduleHours.length) {
      const scheduleMinHour = ~~scheduleHours[0];
      const scheduleMaxHour =
        scheduleHours.length &&
        scheduleEndHours[0] > scheduleHours[scheduleHours.length - 1]
          ? scheduleEndHours[0]
          : scheduleHours[scheduleHours.length - 1];

      min =
        DEFAULT_MIN_HOUR < scheduleMinHour ? DEFAULT_MIN_HOUR : scheduleMinHour;
      max =
        DEFAULT_MAX_HOUR < scheduleMaxHour ? scheduleMaxHour : DEFAULT_MAX_HOUR;
    }

    return generateTimelineHours(min, Math.ceil(max));
  }, [timelineSchedules]);

  const hoursLabel = useMemo(() => {
    if (!hours.length) {
      return [];
    }

    return hours.map((hour) => dayjs(`${hour}:00`, 'H:mm').format('hh:mm A'));
  }, [hours]);

  const timeline: { [key: number]: [] } = useMemo(() => {
    const transformedLessonSchedules = timelineSchedules.lessonSchedules.map(
      (s) => ({ ...s, type: ScheduleType.Lesson }),
    );

    const transformedExamSchedules = timelineSchedules.examSchedules.map(
      (s) => ({ ...s, type: ScheduleType.Exam }),
    );

    const transformedMeetingSchedules = timelineSchedules.meetingSchedules.map(
      (s) => ({ ...s, type: ScheduleType.Meeting }),
    );

    const flatSchedules = [
      ...transformedLessonSchedules,
      ...transformedExamSchedules,
      ...transformedMeetingSchedules,
    ];

    const results = dates.reduce((total, date) => {
      const targetSchedulesByDay = flatSchedules.filter((schedule) =>
        date.isSame(dayjs(schedule.startDate), 'day'),
      );

      let previousSchedulesByHour: any = [];

      const transformedHours = hours.map((hour, index) => {
        const targetSchedulesByHour = generateSchedulesByHour(
          targetSchedulesByDay,
          hour,
        );

        let schedules = targetSchedulesByHour;
        if (previousSchedulesByHour?.length) {
          const filteredSchedules = schedules.filter(
            (s: any) =>
              !previousSchedulesByHour.some((ps: any) => ps && ps.id === s.id),
          );

          schedules = [
            ...previousSchedulesByHour.map((ps: any) => {
              if (!ps) {
                return null;
              }

              return schedules.find((s: any) => s.id === ps.id);
            }),
            ...filteredSchedules,
          ];
        }

        // Set new previous unfinished schedules
        previousSchedulesByHour = schedules.some((s: any) => !s?.isEnd)
          ? schedules.map((s: any) => {
              if (s == null || s.isEnd) {
                return null;
              }

              return s;
            })
          : [];

        // Check if future hours length is more than current, and not isEnd
        if (index < hours.length - 2) {
          const futureSchedulesByHour = generateSchedulesByHour(
            targetSchedulesByDay,
            hours[index + 1],
          );
          const hasConnection = schedules.some((s: any) => {
            if (!s || !s.isStart || s.isEnd) {
              return false;
            }

            return futureSchedulesByHour.some((fs: any) => s.id === fs.id);
          });

          if (
            hasConnection &&
            schedules.length < futureSchedulesByHour.length
          ) {
            schedules = [...schedules, null];
          }
        }

        return { isNn: hour === 12, schedules };
      });

      return {
        ...total,
        [date.day()]: transformedHours,
      };
    }, {});

    return results;
  }, [dates, hours, timelineSchedules]);

  const handleScheduleClick = useCallback(
    (schedule: ScheduleCardType) => () => {
      onScheduleClick && onScheduleClick(schedule);
    },
    [onScheduleClick],
  );

  return (
    <div className={cx('flex w-full items-start', className)} {...moreProps}>
      {loading ? (
        <div className='flex min-h-[200px] w-full items-center justify-center'>
          <BaseSpinner />
        </div>
      ) : (
        <>
          {/* Hour labels */}
          <div>
            <div className='h-[86px]' />
            <div>
              {hoursLabel.map((hour, index) => (
                <div
                  key={`label-h-${index}`}
                  className='relative flex h-16 animate-fastFadeIn flex-col justify-center'
                >
                  <div className='flex items-center'>
                    <div className='flex h-[26px] w-[76px] items-center justify-center rounded border border-accent bg-white text-sm'>
                      {hour}
                    </div>
                    <div className='h-px w-[30px] bg-accent' />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {dates.map((date, index) => (
            <div
              key={index}
              className={cx(
                'min-w-[105px] flex-1 animate-fastFadeIn',
                dayjs(today).isSame(date, 'date') && 'now group',
              )}
            >
              {/* Day */}
              <div className='flex flex-col items-center px-1.5'>
                <div className=' flex h-[62px] w-full flex-col items-center justify-center overflow-hidden rounded-md border border-primary-border-light bg-white font-medium leading-tight group-[.now]:!border-primary group-[.now]:!text-primary'>
                  <span className='text-sm'>{date.format('dddd')}</span>
                  <span>{date.format('DD')}</span>
                </div>
                <div className='h-6 w-px bg-primary-border-light group-[.now]:!bg-primary' />
              </div>
              {/* Schedule */}
              <div>
                {timeline[date.day()].map(({ isNn, schedules }: any, index) => (
                  <div
                    key={`tl-h-${index}`}
                    className={cx(
                      'flex h-16 w-full items-center justify-center gap-x-1 border-b border-l border-b-primary-border border-t-primary-border p-1 first:border-t last:border-b-primary-border-light group-[.now]:!bg-primary-focus-light/20',
                      date.day() !== 0 && date.day() !== 1
                        ? 'border-l-primary-border-light'
                        : 'flex- border-l-primary-border',
                      date.day() !== 0 && !isNn && 'bg-white',
                    )}
                  >
                    {schedules.map((schedule: any, sIndex: number) => (
                      <Fragment key={`tls-${sIndex}`}>
                        {schedule === null ? (
                          <div className='h-full w-full flex-1' />
                        ) : (
                          <ScheduleCalendarCard
                            className='flex-1'
                            schedule={schedule}
                            isCompact={schedules.length > 1}
                            disabled={loading}
                            onClick={handleScheduleClick(schedule)}
                          />
                        )}
                      </Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
});
