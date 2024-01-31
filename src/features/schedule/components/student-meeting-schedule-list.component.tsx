import { memo } from 'react';
import cx from 'classix';

import {
  StudentMeetingScheduleSingleCard,
  StudentMeetingScheduleSingleCardSkeleton,
} from './student-meeting-schedule-single-card.component';

import type { ComponentProps } from 'react';
import type { MeetingSchedule } from '../models/schedule.model';
import { BaseIconButton } from '#/base/components/base-icon-button.component';

type Props = ComponentProps<'div'> & {
  upcomingMeetingSchedules: MeetingSchedule[];
  currentMeetingSchedules: MeetingSchedule[];
  previousMeetingSchedules: MeetingSchedule[];
  title?: string;
  loading?: boolean;
  onRefresh?: () => void;
};

export const StudentMeetingScheduleList = memo(function ({
  className,
  currentMeetingSchedules,
  upcomingMeetingSchedules,
  previousMeetingSchedules,
  title = 'Current Meetings',
  loading,
  onRefresh,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx('flex w-full flex-col gap-2.5', className)}
      {...moreProps}
    >
      <div className='flex items-center justify-between'>
        <h2 className='text-lg'>{title}</h2>
        <BaseIconButton
          name='arrow-clockwise'
          variant='link'
          size='sm'
          onClick={onRefresh}
        />
      </div>
      {loading ? (
        [...Array(2)].map((_, index) => (
          <StudentMeetingScheduleSingleCardSkeleton key={index} />
        ))
      ) : (
        <>
          {!currentMeetingSchedules.length &&
            !upcomingMeetingSchedules.length && (
              <div className='flex w-full justify-center'>
                <span>No current meetings</span>
              </div>
            )}
          {!!currentMeetingSchedules.length && (
            <div className='flex w-full flex-col gap-2.5'>
              {currentMeetingSchedules.map((meetingSchedule) => (
                <StudentMeetingScheduleSingleCard
                  key={`cact-${meetingSchedule.id}`}
                  meetingSchedule={meetingSchedule}
                  primary
                />
              ))}
            </div>
          )}
          {!!upcomingMeetingSchedules.length && (
            <div className='flex w-full flex-col gap-2.5'>
              {upcomingMeetingSchedules.map((meetingSchedule) => (
                <StudentMeetingScheduleSingleCard
                  key={`cact-${meetingSchedule.id}`}
                  meetingSchedule={meetingSchedule}
                  primary
                />
              ))}
            </div>
          )}
          {!!previousMeetingSchedules.length && (
            <div className='flex w-full flex-col gap-2.5'>
              <h2 className='text-lg'>Previous Meetings</h2>
              {previousMeetingSchedules.map((meetingSchedule) => (
                <StudentMeetingScheduleSingleCard
                  key={`cact-${meetingSchedule.id}`}
                  meetingSchedule={meetingSchedule}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
});
