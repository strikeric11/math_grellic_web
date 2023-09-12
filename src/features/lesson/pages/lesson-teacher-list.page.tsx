import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';

import { capitalize } from '#/utils/string.util';
import { RecordStatus } from '#/core/models/core.model';
import { getPaginatedLessonsByCurrentTeacherUser } from '../api/lesson-teacher.api';
import {
  defaultSort,
  useLessonTeacherListPage,
} from '../hooks/use-lesson-teacher-list-page.hook';
import { LessonTeacherList } from '../components/lesson-teacher-list.component';

import type { QueryClient } from '@tanstack/react-query';

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
  const { lessons, setKeyword, setFilters, setSort, refetch } =
    useLessonTeacherListPage();

  return (
    <div className='py-5'>
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
      <LessonTeacherList lessons={lessons} />
      {/* // TODO pagination */}
      <div></div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const loader = (queryClient: QueryClient) => async () => {
  const query = getPaginatedLessonsByCurrentTeacherUser();
  return (
    queryClient.getQueryData(query.queryKey as string[]) ??
    (await queryClient.fetchQuery(query))
  );
};
