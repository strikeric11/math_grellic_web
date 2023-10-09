import { memo, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import cx from 'classix';

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

  const [orderNumber, title, questionCount, schedules] = useMemo(
    () => [
      exam.orderNumber,
      exam.title,
      exam.visibleQuestionsCount,
      exam.schedules,
    ],
    [exam],
  );

  const questionCountText = useMemo(
    () =>
      questionCount > 1 ? `${questionCount} Items` : `${questionCount} Item`,
    [questionCount],
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
      <div className='flex w-full items-center justify-between'>
        <h2 className='pb-1 text-xl'>{title}</h2>
        <div className='flex items-center gap-2.5'>
          <BaseChip iconName='chalkboard-teacher'>Exam {orderNumber}</BaseChip>
          <BaseDivider className='!h-6' vertical />
          <BaseChip iconName='list-numbers'>{questionCountText}</BaseChip>
        </div>
      </div>
      {/* Exam schedules */}
      {!!targetSchedules?.length &&
        targetSchedules.map(({ date, time, duration }, index) => (
          <BaseSurface
            key={index}
            className='my-4 flex h-16 items-center justify-between !px-6 !py-3'
            rounded='xs'
          >
            <div className='flex items-center gap-2.5'>
              <BaseChip iconName='calendar-check'>{date}</BaseChip>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName='clock'>{time}</BaseChip>
              <BaseDivider className='!h-6' vertical />
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
          className='w-full overflow-hidden rounded bg-transparent py-2 !transition-[background] hover:bg-primary hover:text-white'
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
