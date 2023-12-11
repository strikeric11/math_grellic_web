import { memo, useMemo } from 'react';
import DOMPurify from 'dompurify';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { convertSecondsToDuration, getDayJsDuration } from '#/utils/time.util';
import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { StudentUserItem } from '#/user/components/student-user-picker-list.component';

import type { ComponentProps } from 'react';
import type { MeetingSchedule } from '../models/schedule.model';

type Props = ComponentProps<'div'> & {
  meetingSchedule: MeetingSchedule;
};

export const TeacherMeetingScheduleSingle = memo(function ({
  className,
  meetingSchedule,
  ...moreProps
}: Props) {
  const [title, meetingUrl, students] = useMemo(
    () => [
      meetingSchedule.title,
      meetingSchedule.meetingUrl,
      meetingSchedule.students || [],
    ],
    [meetingSchedule],
  );

  const descriptionHtml = useMemo(() => {
    const isEmpty = !DOMPurify.sanitize(meetingSchedule.description || '', {
      ALLOWED_TAGS: [],
    }).trim();

    return !isEmpty
      ? {
          __html: DOMPurify.sanitize(meetingSchedule.description || ''),
        }
      : null;
  }, [meetingSchedule]);

  const [scheduleDate, scheduleTime, scheduleDuration] = useMemo(() => {
    const date = dayjs(meetingSchedule.startDate).format('MMM DD, YYYY');

    const time = `${dayjs(meetingSchedule.startDate).format(
      'hh:mm A',
    )} — ${dayjs(meetingSchedule.endDate).format('hh:mm A')}`;

    const duration = getDayJsDuration(
      meetingSchedule.endDate,
      meetingSchedule.startDate,
    ).asSeconds();

    return [date, time, convertSecondsToDuration(duration)];
  }, [meetingSchedule]);

  return (
    <div className={cx('w-full pb-16', className)} {...moreProps}>
      <div className='flex w-full items-center justify-between'>
        <h2 className='text-xl'>{title}</h2>
        <BaseLink
          to={teacherRoutes.schedule.meeting.editTo}
          className='!px-3'
          variant='solid'
        >
          <BaseIcon name='pencil' size={24} />
        </BaseLink>
      </div>
      <div className='mt-2.5 flex flex-col gap-y-2.5'>
        <BaseDivider />
        <BaseSurface
          className='flex w-full items-center justify-between'
          rounded='sm'
        >
          <h3 className='text-base'>Schedule</h3>
          <div className='flex items-center gap-2.5'>
            <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='hourglass'>{scheduleDuration}</BaseChip>
          </div>
        </BaseSurface>
        <BaseSurface className='flex flex-col gap-y-2.5' rounded='sm'>
          <h3 className='text-base'>Meeting Link</h3>
          <div className='flex justify-start'>
            <BaseLink
              to={meetingUrl}
              target='_blank'
              className='!font-body font-medium'
              rightIconName='arrow-square-out'
            >
              {meetingUrl}
            </BaseLink>
          </div>
          <BaseDivider />
          <div>
            <h3 className='text-base'>
              {descriptionHtml ? 'Description' : 'Meeting has no description'}
            </h3>
            {descriptionHtml && (
              <div
                className='base-rich-text rt-output pr-2.5'
                dangerouslySetInnerHTML={descriptionHtml}
              />
            )}
          </div>
          <BaseDivider />
          <div>
            <h3 className='mb-2 text-base'>Students</h3>
            <div className='flex flex-col gap-y-2.5'>
              {students.map((student) => (
                <StudentUserItem key={`stu-${student.id}`} student={student} />
              ))}
            </div>
          </div>
        </BaseSurface>
      </div>
    </div>
  );
});
