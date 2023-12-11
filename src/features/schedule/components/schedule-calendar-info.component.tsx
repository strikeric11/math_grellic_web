import { memo, useMemo } from 'react';

import dayjs from '#/config/dayjs.config';
import { convertSecondsToDuration, getDayJsDuration } from '#/utils/time.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { ScheduleType } from '../models/schedule.model';

import type { LessonSchedule } from '#/lesson/models/lesson.model';
import type { ExamSchedule } from '#/exam/models/exam.model';
import type { MeetingSchedule, ScheduleCard } from '../models/schedule.model';

type Props = {
  schedule: ScheduleCard | null;
  isStudent?: boolean;
};

const LessonInfo = memo(function ({
  schedule,
  baseTo,
}: {
  schedule: LessonSchedule;
  baseTo: string;
}) {
  const [lesson, scheduleDate, scheduleTime] = useMemo(
    () => [
      schedule.lesson,
      dayjs(schedule.startDate).format('MMM DD, YYYY'),
      dayjs(schedule.startDate).format('hh:mm A'),
    ],
    [schedule],
  );

  const [orderNumber, title, duration, to] = useMemo(
    () => [
      lesson.orderNumber,
      lesson.title,
      convertSecondsToDuration(lesson.durationSeconds || 0, true),
      `${baseTo}/${lesson.slug}`,
    ],
    [lesson, baseTo],
  );

  return (
    <div>
      <div className='flex items-center gap-2.5 pt-1'>
        <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
        <BaseDivider className='!h-6' vertical />
        <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
      </div>
      <BaseDivider className='!mb-2.5 !pt-2.5' />
      <BaseSurface rounded='sm'>
        <div className='flex items-center gap-2.5'>
          {/* Info */}
          <BaseChip iconName='chalkboard-teacher'>
            Lesson {orderNumber}
          </BaseChip>
          <BaseDivider className='!h-6' vertical />
          <BaseChip iconName='hourglass'>{duration}</BaseChip>
        </div>
        {/* Title */}
        <h2 className='pt-2.5 font-body text-lg font-medium tracking-normal text-accent'>
          {title}
        </h2>
      </BaseSurface>
      <div className='flex justify-center py-2.5'>
        <BaseLink to={to} leftIconName='arrow-square-up-right' size='sm'>
          Go to Lesson
        </BaseLink>
      </div>
    </div>
  );
});

const ExamInfo = memo(function ({
  schedule,
  baseTo,
}: {
  schedule: ExamSchedule;
  baseTo: string;
}) {
  const [exam, startDate, endDate] = useMemo(
    () => [schedule.exam, schedule.startDate, schedule.endDate],
    [schedule],
  );

  const [scheduleDate, scheduleTime, scheduleDuration] = useMemo(() => {
    if (!dayjs(startDate).isSame(endDate, 'day')) {
      return [];
    }

    const date = dayjs(startDate).format('MMM DD, YYYY');
    const time = `${dayjs(startDate).format('hh:mm A')} — ${dayjs(
      endDate,
    ).format('hh:mm A')}`;
    const duration = getDayJsDuration(endDate, startDate).asSeconds();

    return [date, time, convertSecondsToDuration(duration)];
  }, [startDate, endDate]);

  const [
    orderNumber,
    title,
    passingPoints,
    totalPoints,
    randomizeQuestions,
    to,
  ] = useMemo(
    () => [
      exam.orderNumber,
      exam.title,
      exam.passingPoints,
      exam.pointsPerQuestion * exam.visibleQuestionsCount,
      exam.randomizeQuestions,
      `${baseTo}/${exam.slug}`,
    ],
    [exam, baseTo],
  );

  const passingPointsText = useMemo(
    () =>
      passingPoints > 1
        ? `${passingPoints} Passing Points`
        : `${passingPoints} Passing Point`,
    [passingPoints],
  );

  const totalPointsText = useMemo(
    () =>
      totalPoints > 1
        ? `${totalPoints} Total Points`
        : `${totalPoints} Total Point`,
    [totalPoints],
  );

  return (
    <div>
      <div className='flex items-center gap-2.5 pt-1'>
        <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
        <BaseDivider className='!h-6' vertical />
        <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
        <BaseDivider className='!h-6' vertical />
        <BaseChip iconName='hourglass'>{scheduleDuration}</BaseChip>
      </div>
      <BaseDivider className='!mb-2.5 !pt-2.5' />
      <BaseSurface rounded='sm'>
        <div className='flex items-center gap-2.5'>
          {/* Info */}
          <BaseChip iconName='chalkboard-teacher'>Exam {orderNumber}</BaseChip>
          <BaseDivider className='!h-6' vertical />
          <BaseChip iconName='list-numbers'>{totalPointsText}</BaseChip>
          <BaseDivider className='!h-6' vertical />
          <BaseChip iconName='list-checks'>{passingPointsText}</BaseChip>
          {randomizeQuestions && (
            <>
              <BaseDivider className='!h-6' vertical />
              <BaseChip iconName='check-square'>Randomized</BaseChip>
            </>
          )}
        </div>
        {/* Title */}
        <h2 className='pt-2.5 font-body text-lg font-medium tracking-normal text-accent'>
          {title}
        </h2>
      </BaseSurface>
      <div className='flex justify-center py-2.5'>
        <BaseLink to={to} leftIconName='arrow-square-up-right' size='sm'>
          Go to Exam
        </BaseLink>
      </div>
    </div>
  );
});

const MeetingInfo = memo(function ({
  schedule,
  baseTo,
}: {
  schedule: MeetingSchedule;
  baseTo: string;
}) {
  const [title, startDate, endDate, to] = useMemo(
    () => [
      schedule.title,
      schedule.startDate,
      schedule.endDate,
      `${baseTo}/${schedule.id}`,
    ],
    [schedule, baseTo],
  );

  const [scheduleDate, scheduleTime, scheduleDuration] = useMemo(() => {
    if (!dayjs(startDate).isSame(endDate, 'day')) {
      return [];
    }

    const date = dayjs(startDate).format('MMM DD, YYYY');
    const time = `${dayjs(startDate).format('hh:mm A')} — ${dayjs(
      endDate,
    ).format('hh:mm A')}`;
    const duration = getDayJsDuration(endDate, startDate).asSeconds();

    return [date, time, convertSecondsToDuration(duration)];
  }, [startDate, endDate]);

  return (
    <div>
      <div className='flex items-center gap-2.5 pt-1'>
        <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
        <BaseDivider className='!h-6' vertical />
        <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
        <BaseDivider className='!h-6' vertical />
        <BaseChip iconName='hourglass'>{scheduleDuration}</BaseChip>
      </div>
      <BaseDivider className='!mb-2.5 !pt-2.5' />
      <BaseSurface rounded='sm'>
        {/* Title */}
        <h2 className='font-body text-lg font-medium tracking-normal text-accent'>
          {title}
        </h2>
      </BaseSurface>
      <div className='flex justify-center py-2.5'>
        <BaseLink to={to} leftIconName='arrow-square-up-right' size='sm'>
          Go to Meeting
        </BaseLink>
      </div>
    </div>
  );
});

export const ScheduleCalendarInfo = memo(function ({
  schedule,
  isStudent,
}: Props) {
  const type = useMemo(() => schedule?.type, [schedule]);

  const [lessonBaseTo, examBaseTo, meetingBaseTo] = useMemo(() => {
    const baseRoute = isStudent ? studentBaseRoute : teacherBaseRoute;
    const routes = isStudent ? studentRoutes : teacherRoutes;

    return [
      `/${baseRoute}/${routes.lesson.to}`,
      `/${baseRoute}/${routes.exam.to}`,
      `/${baseRoute}/${routes.schedule.to}/${routes.schedule.meeting.to}`,
    ];
  }, [isStudent]);

  if (!type) {
    return null;
  }

  if (type === ScheduleType.Lesson) {
    return (
      <LessonInfo schedule={schedule as LessonSchedule} baseTo={lessonBaseTo} />
    );
  } else if (type === ScheduleType.Exam) {
    return <ExamInfo schedule={schedule as ExamSchedule} baseTo={examBaseTo} />;
  } else {
    return (
      <MeetingInfo
        schedule={schedule as MeetingSchedule}
        baseTo={meetingBaseTo}
      />
    );
  }
});
