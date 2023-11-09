import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import {
  TeacherMeetingScheduleSingleCard,
  TeacherMeetingScheduleSingleCardSkeleton,
} from './teacher-meeting-schedule-single-card.component';

import type { ComponentProps } from 'react';
import type { MeetingSchedule } from '../models/schedule.model';

type Props = ComponentProps<'div'> & {
  meetingSchedules: MeetingSchedule[];
  loading?: boolean;
  onMeetingScheduleDetails?: (id: number) => void;
  onMeetingScheduleEdit?: (id: number) => void;
};

export const TeacherMeetingScheduleList = memo(function ({
  className,
  meetingSchedules,
  loading,
  onMeetingScheduleDetails,
  onMeetingScheduleEdit,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => !meetingSchedules?.length, [meetingSchedules]);

  const handleMeetingScheduleDetails = useCallback(
    (id: number) => () => {
      onMeetingScheduleDetails && onMeetingScheduleDetails(id);
    },
    [onMeetingScheduleDetails],
  );

  const handleMeetingScheduleEdit = useCallback(
    (id: number) => () => {
      onMeetingScheduleEdit && onMeetingScheduleEdit(id);
    },
    [onMeetingScheduleEdit],
  );

  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      role='table'
      {...moreProps}
    >
      {loading ? (
        [...Array(4)].map((_, index) => (
          <TeacherMeetingScheduleSingleCardSkeleton key={index} />
        ))
      ) : isEmpty ? (
        <BaseDataEmptyMessage
          message='No meeting available'
          linkTo={`${teacherRoutes.schedule.meeting.createTo}`}
        />
      ) : (
        meetingSchedules.map((meetingSchedule) => (
          <TeacherMeetingScheduleSingleCard
            key={`ms-${meetingSchedule.id}`}
            meetingSchedule={meetingSchedule}
            onDetails={handleMeetingScheduleDetails(meetingSchedule.id)}
            onEdit={handleMeetingScheduleEdit(meetingSchedule.id)}
            role='row'
          />
        ))
      )}
    </div>
  );
});
