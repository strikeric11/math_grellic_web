import { memo, useCallback, useMemo } from 'react';

import dayjs from '#/config/dayjs.config';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { ScheduleDailyCardList } from './schedule-daily-card-list.component';

import type { ComponentProps } from 'react';
import type { ExamSchedule } from '#/exam/models/exam.model';
import type { LessonSchedule } from '#/lesson/models/lesson.model';
import type { MeetingSchedule } from '../models/schedule.model';

type Props = ComponentProps<'div'> & {
  schedules: (LessonSchedule | ExamSchedule | MeetingSchedule)[];
  today: Date | null;
  currentDate: Date | null;
  setCurrentDate: (date: Date) => void;
  title?: string;
  loading?: boolean;
};

const SCHEDULE_PATH = `/${teacherBaseRoute}/${teacherRoutes.schedule.to}`;

export const TeacherScheduleDailyCardList = memo(function ({
  loading,
  schedules,
  today,
  currentDate,
  setCurrentDate,
  title,
  ...moreProps
}: Props) {
  const currentDateText = useMemo(() => {
    const targetDate = currentDate || today;

    if (!targetDate) {
      return '';
    }

    return dayjs(targetDate).format('dddd, MMM DD');
  }, [today, currentDate]);

  const handleChange = useCallback(
    (isNext: boolean) => () => {
      const targetDate = currentDate || today;

      if (!targetDate) {
        return;
      }

      const value = (
        isNext
          ? dayjs(targetDate).add(1, 'day')
          : dayjs(targetDate).subtract(1, 'day')
      ).toDate();

      setCurrentDate(value);
    },
    [today, currentDate, setCurrentDate],
  );

  return (
    <div {...moreProps}>
      {title && <h2 className='mb-2.5 text-lg'>{title}</h2>}
      <div className='flex items-stretch border-b border-b-accent/20'>
        <div className='flex h-8 w-[84px] items-center justify-center overflow-hidden border-r border-r-accent/20 pb-2 pt-1'>
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
        <div className='flex flex-1 items-center justify-center'>
          <span className='font-medium'>{currentDateText}</span>
        </div>
      </div>
      <ScheduleDailyCardList
        schedules={schedules}
        scheduleTo={SCHEDULE_PATH}
        scheduleCardWrapperClassName='pt-2.5'
        loading={loading}
      />
    </div>
  );
});
