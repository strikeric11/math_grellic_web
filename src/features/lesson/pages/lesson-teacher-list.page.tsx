import { getLessonsByCurrentTeacherUser } from '../api/lesson-teacher.api';
import type { QueryClient } from '@tanstack/react-query';

export function LessonTeacherListPage() {
  return <div>lesson list</div>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const loader = (queryClient: QueryClient) => async () => {
  const query = getLessonsByCurrentTeacherUser();
  return (
    queryClient.getQueryData(query.queryKey as string[]) ??
    (await queryClient.fetchQuery(query))
  );
};
