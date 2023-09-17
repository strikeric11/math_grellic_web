import { memo, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import cx from 'classix';

import { convertSecondsToDuration } from '#/utils/time.util';
import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';

import type { ComponentProps } from 'react';
import type { ButtonVariant } from '#/base/models/base.model';
import type { Lesson } from '../models/lesson.model';

type Props = ComponentProps<'div'> & {
  lesson: Lesson;
};

const scheduleButtonProps = {
  className: '!text-base',
  variant: 'link' as ButtonVariant,
  bodyFont: true,
};

export const TeacherLessonScheduleListOverview = memo(function ({
  className,
  lesson,
}: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const orderNumber = useMemo(() => lesson.orderNumber, [lesson]);
  const title = useMemo(() => lesson.title, [lesson]);

  const duration = useMemo(
    () => convertSecondsToDuration(lesson.durationSeconds || 0, true),
    [lesson],
  );

  const [scheduleDate, scheduleTime] = useMemo(() => {
    if (!lesson.schedules?.length) {
      return [];
    }

    return [
      dayjs(lesson.schedules[0].startDate).format('MMM DD, YYYY'),
      dayjs(lesson.schedules[0].startDate).format('hh:mm A'),
    ];
  }, [lesson]);

  const isUpsert = useMemo(() => {
    const paths = pathname.split('/');
    const currentPath = paths[paths.length - 1];
    return (
      currentPath === teacherRoutes.lesson.schedule.editTo ||
      currentPath === teacherRoutes.lesson.schedule.createTo
    );
  }, [pathname]);

  const handleUpsertSchedule = useCallback(
    (isEdit?: boolean) => () => {
      if (isUpsert) {
        navigate(-1);
        return;
      }

      if (isEdit) {
        navigate(teacherRoutes.lesson.schedule.editTo);
      } else {
        navigate(teacherRoutes.lesson.schedule.createTo);
      }
    },
    [isUpsert, navigate],
  );

  return (
    <div className={cx('w-full', className)}>
      {/* Lesson details */}
      <div className='flex w-full items-center justify-between'>
        <h2 className='pb-1 text-xl'>{title}</h2>
        <div className='flex items-center gap-2.5'>
          <BaseChip iconName='chalkboard-teacher'>
            Lesson {orderNumber}
          </BaseChip>
          <BaseDivider className='!h-6' vertical />
          <BaseChip iconName='hourglass'>{duration}</BaseChip>
        </div>
      </div>
      {/* Lesson schedule */}
      <div className='my-4 flex h-16 items-center justify-between rounded border border-accent/20 bg-white px-6 py-3'>
        {scheduleDate ? (
          <>
            <div className='flex items-center gap-2.5'>
              <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
            </div>
            <BaseButton
              {...scheduleButtonProps}
              onClick={handleUpsertSchedule(true)}
            >
              {isUpsert ? 'Cancel' : 'Edit Schedule'}
            </BaseButton>
          </>
        ) : (
          <>
            <span>Lesson has no schedule</span>
            <BaseButton
              {...scheduleButtonProps}
              onClick={handleUpsertSchedule()}
            >
              {isUpsert ? 'Cancel' : 'Set Schedule'}
            </BaseButton>
          </>
        )}
      </div>
    </div>
  );
});
