import { memo, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { getDayJsDuration, convertSecondsToDuration } from '#/utils/time.util';
import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { ButtonVariant } from '#/base/models/base.model';
import type { Exam, ExamSchedule } from '../models/exam.model';

type Props = ComponentProps<'div'> & {
  exam: Exam;
  currentExamSchedule?: ExamSchedule;
  onUpsert?: (examSchedule: ExamSchedule | undefined) => void;
};

const scheduleButtonProps = {
  className: '!text-base',
  variant: 'link' as ButtonVariant,
  bodyFont: true,
};

export const TeacherExamScheduleListOverview = memo(function ({
  className,
  exam,
  currentExamSchedule,
  onUpsert,
}: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [orderNumber, title, totalPoints, schedules] = useMemo(
    () => [
      exam.orderNumber,
      exam.title,
      exam.pointsPerQuestion * exam.visibleQuestionsCount,
      exam.schedules,
    ],
    [exam],
  );

  const totalPointsText = useMemo(
    () =>
      totalPoints > 1
        ? `${totalPoints} Total Points`
        : `${totalPoints} Total Point`,
    [totalPoints],
  );

  const isUpsert = useMemo(() => {
    const paths = pathname.split('/');
    const currentPath = paths[paths.length - 1];
    return (
      currentPath === teacherRoutes.lesson.schedule.editTo ||
      currentPath === teacherRoutes.lesson.schedule.createTo
    );
  }, [pathname]);

  const targetSchedules = useMemo(() => {
    if (!schedules?.length) {
      return [];
    }

    if (isUpsert) {
      if (currentExamSchedule) {
        const { startDate, endDate } = currentExamSchedule;
        const date = dayjs(startDate).format('MMM DD, YYYY');
        const time = `${dayjs(startDate).format('hh:mm A')} — ${dayjs(
          endDate,
        ).format('hh:mm A')}`;
        const duration = getDayJsDuration(endDate, startDate).asSeconds();

        return [{ date, time, duration: convertSecondsToDuration(duration) }];
      } else {
        return [];
      }
    }

    return schedules
      .filter((s) => dayjs(s.startDate).isSame(s.endDate, 'day'))
      .map((schedule) => {
        const { startDate, endDate } = schedule;

        const date = dayjs(startDate).format('MMM DD, YYYY');
        const time = `${dayjs(startDate).format('hh:mm A')} — ${dayjs(
          endDate,
        ).format('hh:mm A')}`;
        const duration = getDayJsDuration(endDate, startDate).asSeconds();

        return { date, time, duration: convertSecondsToDuration(duration) };
      });
  }, [schedules, currentExamSchedule, isUpsert]);

  const handleUpsertSchedule = useCallback(
    (examSchedule?: ExamSchedule) => () => {
      if (isUpsert) {
        onUpsert && onUpsert(undefined);
        navigate('.');
        return;
      }

      if (examSchedule) {
        onUpsert && onUpsert(examSchedule);
        navigate(teacherRoutes.lesson.schedule.editTo);
      } else {
        onUpsert && onUpsert(undefined);
        navigate(teacherRoutes.lesson.schedule.createTo);
      }
    },
    [isUpsert, navigate, onUpsert],
  );

  return (
    <div className={cx('w-full', className)}>
      {/* Exam details */}
      <div className='flex w-full flex-col items-start justify-between gap-2.5 sm:flex-row sm:items-center'>
        <h2 className='text-xl sm:pb-1'>{title}</h2>
        <div className='flex items-center gap-2.5'>
          <BaseChip iconName='chalkboard-teacher'>Exam {orderNumber}</BaseChip>
          <BaseDivider className='!h-6' vertical />
          <BaseChip iconName='list-numbers'>{totalPointsText}</BaseChip>
        </div>
      </div>
      {/* Exam schedules */}
      {!!targetSchedules?.length &&
        targetSchedules.map(({ date, time, duration }, index) => (
          <BaseSurface
            key={index}
            className='my-4 flex flex-col items-start justify-between gap-2.5 !px-6 !py-3 -3xs:flex-row -3xs:items-center -3xs:gap-0 sm:h-16'
            rounded='xs'
          >
            <div className='flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2.5'>
              <BaseChip iconName='calendar-check'>{date}</BaseChip>
              <BaseDivider className='hidden !h-6 sm:block' vertical />
              <BaseChip iconName='clock'>{time}</BaseChip>
              <BaseDivider className='hidden !h-6 sm:block' vertical />
              <BaseChip iconName='hourglass'>{duration}</BaseChip>
            </div>
            <BaseButton
              {...scheduleButtonProps}
              onClick={handleUpsertSchedule(
                schedules?.length ? schedules[index] : undefined,
              )}
            >
              {isUpsert ? 'Cancel' : 'Edit Schedule'}
            </BaseButton>
          </BaseSurface>
        ))}
      {!currentExamSchedule && (
        <BaseButton
          className='mt-2.5 w-full overflow-hidden rounded bg-transparent py-2 !transition-[background] hover:bg-primary hover:text-white sm:mt-0'
          leftIconName={isUpsert ? 'x-circle' : 'plus-circle'}
          variant='link'
          size='sm'
          onClick={handleUpsertSchedule()}
        >
          {isUpsert ? 'Cancel New Schedule' : 'Add Schedule'}
        </BaseButton>
      )}
    </div>
  );
});
