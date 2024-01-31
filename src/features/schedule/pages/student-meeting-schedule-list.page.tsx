import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { useStudentMeetingScheduleList } from '../hooks/use-student-meeting-schedule-list.hook';
import { StudentMeetingScheduleList } from '../components/student-meeting-schedule-list.component';

export function StudentMeetingScheduleListPage() {
  const {
    loading,
    upcomingMeetingSchedules,
    currentMeetingSchedules,
    previousMeetingSchedules,
    refetch,
  } = useStudentMeetingScheduleList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
        <div className='flex w-full flex-1 flex-col self-stretch'>
          <StudentMeetingScheduleList
            className='mb-5'
            upcomingMeetingSchedules={upcomingMeetingSchedules}
            currentMeetingSchedules={currentMeetingSchedules}
            previousMeetingSchedules={previousMeetingSchedules}
            loading={loading}
            onRefresh={refetch}
          />
        </div>
        {/* TODO sidebar components */}
        {/* <BaseRightSidebar /> */}
      </div>
    </BaseDataSuspense>
  );
}
