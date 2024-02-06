import { useLoaderData } from 'react-router-dom';

import { capitalize } from '#/utils/string.util';
import { RecordStatus } from '#/core/models/core.model';
import { StudentPerformanceType } from '#/performance/models/performance.model';
import { useTeacherActivityPerformanceOverview } from '#/performance/hooks/use-teacher-activity-performance-overview.hook';
import { useTeacherStudentPerformanceLeaderboard } from '#/performance/hooks/use-teacher-student-performance-leaderboard.hook';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseDataPagination } from '#/base/components/base-data-pagination.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { TeacherActivityPerformanceOverview } from '#/performance/components/teacher-activity-performance-overview.component';
import { TeacherStudentPerformanceLeaderboard } from '#/performance/components/teacher-student-performance-leaderboard.component';
import {
  defaultSort,
  useTeacherActivityList,
} from '../hooks/use-teacher-activity-list.hook';
import { TeacherActivityList } from '../components/teacher-activity-list.component';

const filterOptions = [
  {
    key: 'status-published',
    name: 'status',
    value: RecordStatus.Published,
    label: capitalize(RecordStatus.Published),
  },
  {
    key: 'status-draft',
    name: 'status',
    value: RecordStatus.Draft,
    label: capitalize(RecordStatus.Draft),
  },
];

const sortOptions = [
  {
    value: 'orderNumber',
    label: 'Activity Number',
  },
  {
    value: 'title',
    label: 'Activity Title',
  },
];

export function TeacherActivityListPage() {
  const {
    activities,
    loading,
    setKeyword,
    setFilters,
    setSort,
    refresh,
    totalCount,
    pagination,
    nextPage,
    prevPage,
    handleActivityEdit,
    handleActivityDetails,
    handleActivityPreview,
  } = useTeacherActivityList();

  const { loading: activityPerformanceLoading, activityPerformance } =
    useTeacherActivityPerformanceOverview();

  const { loading: activityLeaderboardLoading, students } =
    useTeacherStudentPerformanceLeaderboard(StudentPerformanceType.Activity);

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
        <div className='flex w-full flex-1 flex-col self-stretch'>
          <BaseDataToolbar
            className='mb-5'
            filterOptions={filterOptions}
            defaulSelectedtFilterOptions={filterOptions}
            defaultSelectedSort={defaultSort}
            sortOptions={sortOptions}
            onSearchChange={setKeyword}
            onRefresh={refresh}
            onFilter={setFilters}
            onSort={setSort}
          />
          <TeacherActivityList
            activities={activities}
            loading={loading}
            onActivityDetails={handleActivityDetails}
            onActivityPreview={handleActivityPreview}
            onActivityEdit={handleActivityEdit}
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
        <BaseRightSidebar>
          <div className='flex flex-col gap-5'>
            <TeacherActivityPerformanceOverview
              activityPerformance={activityPerformance}
              loading={activityPerformanceLoading}
            />
            <TeacherStudentPerformanceLeaderboard
              students={students}
              performance={StudentPerformanceType.Activity}
              loading={activityLeaderboardLoading}
            />
          </div>
        </BaseRightSidebar>
      </div>
    </BaseDataSuspense>
  );
}
