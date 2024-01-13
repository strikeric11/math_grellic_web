import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { capitalize } from '#/utils/string.util';
import { useTeacherClassPerformance } from '#/dashboard/hooks/use-teacher-class-performance.hook';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { BaseDataPagination } from '#/base/components/base-data-pagination.component';
import { StudentPerformanceType } from '../models/performance.model';
import {
  defaultSort,
  useStudentPerformanceList,
} from '../hooks/use-student-performance-list.hook';
import { StudentPerformanceList } from '../components/student-performance-list.component';
import { TeacherStudentPerformanceOverview } from '../components/teacher-student-performance-overview.component';

const filterOptions = [
  {
    key: 'performance-exam',
    name: 'performance',
    value: StudentPerformanceType.Exam,
    label: `Overall ${capitalize(StudentPerformanceType.Exam)}`,
  },
  {
    key: 'performance-activity',
    name: 'performance',
    value: StudentPerformanceType.Activity,
    label: `Overall ${capitalize(StudentPerformanceType.Activity)}`,
  },
  {
    key: 'performance-lesson',
    name: 'performance',
    value: StudentPerformanceType.Lesson,
    label: `Overall ${capitalize(StudentPerformanceType.Lesson)}`,
  },
];

const sortOptions = [
  {
    value: 'rank',
    label: 'Student Ranking',
  },
  {
    value: 'name',
    label: 'Student Name',
  },
];

export function StudentPerformanceListPage() {
  const {
    students,
    loading,
    totalCount,
    pagination,
    performance,
    setKeyword,
    setFilters,
    setSort,
    refresh,
    nextPage,
    prevPage,
    handlePerformanceDetails,
  } = useStudentPerformanceList();

  const { classLoading, teacherClassPerformance } =
    useTeacherClassPerformance();

  const data: any = useLoaderData();

  const defaulSelectedtFilterOptions = useMemo(() => [filterOptions[0]], []);

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
        <div className='flex w-full flex-1 flex-col self-stretch'>
          <BaseDataToolbar
            className='mb-5'
            filterOptions={filterOptions}
            defaulSelectedtFilterOptions={defaulSelectedtFilterOptions}
            defaultSelectedSort={defaultSort}
            sortOptions={sortOptions}
            onSearchChange={setKeyword}
            onRefresh={refresh}
            onFilter={setFilters}
            onSort={setSort}
            singleFilterOnly
          />
          <StudentPerformanceList
            students={students}
            performance={performance}
            loading={loading}
            onPerformanceDetails={handlePerformanceDetails}
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
          <TeacherStudentPerformanceOverview
            teacherClassPerformance={teacherClassPerformance}
            loading={classLoading}
          />
        </BaseRightSidebar>
      </div>
    </BaseDataSuspense>
  );
}
