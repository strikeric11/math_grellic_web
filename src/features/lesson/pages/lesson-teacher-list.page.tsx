import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';

import { getPaginatedLessonsByCurrentTeacherUser } from '../api/lesson-teacher.api';
import { useLessonTeacherListPage } from '../hooks/use-lesson-teacher-list-page.hook';
import { LessonTeacherList } from '../components/lesson-teacher-list.component';

import type { QueryClient } from '@tanstack/react-query';

export function LessonTeacherListPage() {
  const { lessons, setKeyword, setFilters, refetch } =
    useLessonTeacherListPage();

  return (
    <div className='py-5'>
      <BaseDataToolbar
        className='mb-5'
        onSearchChange={setKeyword}
        onRefresh={refetch}
        onFilter={setFilters}
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
