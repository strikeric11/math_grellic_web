import { capitalize } from '#/utils/string.util';
import { RecordStatus } from '#/core/models/core.model';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseDataPagination } from '#/base/components/base-data-pagination.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
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
    setKeyword,
    setFilters,
    setSort,
    refetch,
    totalCount,
    pagination,
    nextPage,
    prevPage,
    handleLessonUpdate,
    handleLessonPreview,
  } = useLessonTeacherList();

  return (
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
          onLessonUpdate={handleLessonUpdate}
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
  );
}
