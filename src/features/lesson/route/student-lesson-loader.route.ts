import { defer } from 'react-router-dom';

import { getLessonsByCurrentStudentUser } from '../api/student-lesson.api';

import type { QueryClient } from '@tanstack/react-query';

export const getLessonsLoader = (queryClient: QueryClient) => async () => {
  const query = getLessonsByCurrentStudentUser();
  return defer({
    main:
      queryClient.getQueryData(query.queryKey as string[]) ??
      queryClient.fetchQuery(query),
  });
};
