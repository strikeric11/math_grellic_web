import { useCallback, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import { BaseModal } from '#/base/components/base-modal.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { useTeacherScheduleCalendar } from '../hooks/use-teacher-schedule-calendar.hook';
import { ScheduleWeeklyCalendarSelector } from '../components/schedule-weekly-calendar-selector.component';
import { ScheduleWeeklyCalendar } from '../components/schedule-weekly-calendar.component';
import { ScheduleCalendarInfo } from '../components/schedule-calendar-info.component';

import type { ScheduleCard } from '../models/schedule.model';

export function TeacherScheduleCalendarPage() {
  const {
    loading,
    timelineSchedules,
    today,
    weekIndex,
    handleWeekIndexChange,
    refresh,
  } = useTeacherScheduleCalendar();
  const data: any = useLoaderData();

  const [openModal, setOpenModal] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleCard | null>(
    null,
  );

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      !loading && setOpenModal(isOpen);
    },
    [loading],
  );

  const handleScheduleClick = useCallback(
    (schedule: ScheduleCard) => {
      setCurrentSchedule(schedule);
      handleSetModal(true)();
    },
    [handleSetModal],
  );

  return (
    <>
      <BaseDataSuspense resolve={data?.main}>
        <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
          <div className='flex w-full flex-1 flex-col self-stretch pb-5'>
            {!!today && (
              <>
                <ScheduleWeeklyCalendarSelector
                  className='mb-5'
                  loading={loading}
                  today={today}
                  weekIndex={weekIndex}
                  onWeekIndexChange={handleWeekIndexChange}
                  onRefresh={refresh}
                />
                {!!timelineSchedules && (
                  <ScheduleWeeklyCalendar
                    loading={loading}
                    today={today}
                    weekIndex={weekIndex}
                    timelineSchedules={timelineSchedules}
                    onScheduleClick={handleScheduleClick}
                  />
                )}
              </>
            )}
          </div>
          {/* TODO sidebar components */}
          <BaseRightSidebar />
        </div>
      </BaseDataSuspense>
      <BaseModal size='sm' open={openModal} onClose={handleSetModal(false)}>
        <div>
          <ScheduleCalendarInfo schedule={currentSchedule} />
        </div>
      </BaseModal>
    </>
  );
}
