import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseDataPagination } from '#/base/components/base-data-pagination.component';
import {
  defaultSort,
  useTeacherMeetingScheduleList,
} from '../hooks/use-teacher-meeting-schedule-list.hook';
import { TeacherMeetingScheduleList } from '../components/teacher-meeting-schedule-list.component';

const sortOptions = [
  {
    value: 'scheduleDate',
    label: 'Schedule Date',
  },
  {
    value: 'title',
    label: 'Meeting Title',
  },
];

export function TeacherMeetingScheduleListPage() {
  const {
    meetingSchedules,
    loading,
    totalCount,
    pagination,
    setKeyword,
    setSort,
    refresh,
    nextPage,
    prevPage,
    handleMeetingScheduleEdit,
    handleMeetingScheduleDetails,
  } = useTeacherMeetingScheduleList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
        <div className='flex w-full flex-1 flex-col self-stretch'>
          <BaseDataToolbar
            className='mb-5'
            defaultSelectedSort={defaultSort}
            sortOptions={sortOptions}
            onSearchChange={setKeyword}
            onRefresh={refresh}
            onSort={setSort}
          />
          <TeacherMeetingScheduleList
            meetingSchedules={meetingSchedules}
            loading={loading}
            onMeetingScheduleDetails={handleMeetingScheduleDetails}
            onMeetingScheduleEdit={handleMeetingScheduleEdit}
          />
          {!!totalCount && (
            <BaseDataPagination
              totalCount={totalCount}
              pagination={pagination}
              onNext={nextPage}
              onPrev={prevPage}
            />
          )}
        </div>
        {/* TODO sidebar components */}
        {/* <BaseRightSidebar /> */}
      </div>
    </BaseDataSuspense>
  );
}
