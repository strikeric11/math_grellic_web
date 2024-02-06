import { useLoaderData } from 'react-router-dom';

import { capitalize } from '#/utils/string.util';
import { RecordStatus } from '#/core/models/core.model';
import { ScheduleType } from '#/schedule/models/schedule.model';
import { StudentPerformanceType } from '#/performance/models/performance.model';
import { useTeacherScheduleDailyList } from '#/schedule/hooks/use-teacher-schedule-daily-list.hook';
import { useTeacherExamPerformanceOverview } from '#/performance/hooks/use-teacher-exam-performance-overview.hook';
import { useTeacherStudentPerformanceLeaderboard } from '#/performance/hooks/use-teacher-student-performance-leaderboard.hook';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseDataPagination } from '#/base/components/base-data-pagination.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { TeacherScheduleDailyCardList } from '#/schedule/components/teacher-schedule-daily-card-list.component';
import { TeacherExamPerformanceOverview } from '#/performance/components/teacher-exam-performance-overview.component';
import { TeacherStudentPerformanceLeaderboard } from '#/performance/components/teacher-student-performance-leaderboard.component';
import {
  defaultSort,
  useTeacherExamList,
} from '../hooks/use-teacher-exam-list.hook';
import { TeacherExamList } from '../components/teacher-exam-list.component';

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
    label: 'Exam Number',
  },
  {
    value: 'title',
    label: 'Exam Title',
  },
  {
    value: 'scheduleDate',
    label: 'Schedule Date',
  },
];

export function TeacherExamListPage() {
  const {
    exams,
    loading,
    setKeyword,
    setFilters,
    setSort,
    refresh,
    totalCount,
    pagination,
    nextPage,
    prevPage,
    handleExamEdit,
    handleExamDetails,
    handleExamPreview,
    handleExamSchedule,
  } = useTeacherExamList();

  const {
    loading: dailyScheduleLoading,
    today,
    currentDate,
    setCurrentDate,
    schedules,
  } = useTeacherScheduleDailyList(ScheduleType.Exam);

  const { loading: examPerformanceLoading, examPerformance } =
    useTeacherExamPerformanceOverview();

  const { loading: examLeaderboardLoading, students } =
    useTeacherStudentPerformanceLeaderboard(StudentPerformanceType.Exam);

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
          <TeacherExamList
            exams={exams}
            loading={loading}
            onExamDetails={handleExamDetails}
            onExamPreview={handleExamPreview}
            onExamEdit={handleExamEdit}
            onExamSchedule={handleExamSchedule}
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
          <div className='flex max-h-[600px] flex-col gap-5 lg:max-h-full'>
            <TeacherScheduleDailyCardList
              schedules={schedules}
              today={today}
              currentDate={currentDate}
              title='Exam Schedules'
              loading={dailyScheduleLoading}
              setCurrentDate={setCurrentDate}
            />
            <TeacherExamPerformanceOverview
              examPerformance={examPerformance}
              loading={examPerformanceLoading}
            />
            <TeacherStudentPerformanceLeaderboard
              students={students}
              performance={StudentPerformanceType.Exam}
              loading={examLeaderboardLoading}
            />
          </div>
        </BaseRightSidebar>
      </div>
    </BaseDataSuspense>
  );
}
