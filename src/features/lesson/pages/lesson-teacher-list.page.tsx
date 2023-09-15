import { useLoaderData } from 'react-router-dom';

import { capitalize } from '#/utils/string.util';
import { RecordStatus } from '#/core/models/core.model';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseDataPagination } from '#/base/components/base-data-pagination.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import {
  defaultSort,
  useLessonTeacherList,
} from '../hooks/use-lesson-teacher-list.hook';
import { LessonTeacherList } from '../components/lesson-teacher-list.component';

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
    label: 'Lesson Number',
  },
  {
    value: 'title',
    label: 'Lesson Title',
  },
];

export function LessonTeacherListPage() {
  const {
    lessons,
    loading,
    setKeyword,
    setFilters,
    setSort,
    refetch,
    totalCount,
    pagination,
    nextPage,
    prevPage,
    handleLessonUpdate,
    handleLessonDetails,
    handleLessonPreview,
  } = useLessonTeacherList();

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
            onRefresh={refetch}
            onFilter={setFilters}
            onSort={setSort}
          />
          <LessonTeacherList
            lessons={lessons}
            loading={loading}
            onLessonUpdate={handleLessonUpdate}
            onLessonDetails={handleLessonDetails}
            onLessonPreview={handleLessonPreview}
          />
          <BaseDataPagination
            totalCount={totalCount}
            pagination={pagination}
            onNext={nextPage}
            onPrev={prevPage}
          />
        </div>
        {/* TODO sidebar components */}
        <BaseRightSidebar />
      </div>
    </BaseDataSuspense>
  );
}
