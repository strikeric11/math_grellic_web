import { useMemo } from 'react';

import { transformToLesson } from '../helpers/lesson-transform.helper';
import { getLessonBySlugAndCurrentTeacherUser } from '../api/lesson-teacher.api';

import type { Lesson } from '../models/lesson.model';
import { useQuery } from '@tanstack/react-query';

type Result = {
  titlePreview: string;
  lesson?: Lesson | null;
};

export function useLessonPreviewSlugPage(slug: string): Result {
  const { data: lesson } = useQuery(
    getLessonBySlugAndCurrentTeacherUser(slug, {
      refetchOnWindowFocus: false,
      select: (data: any) => {
        return transformToLesson(data);
      },
    }),
  );

  const titlePreview = useMemo(
    () => (lesson?.title ? `${lesson?.title} (Preview)` : 'Preview'),
    [lesson],
  );

  return { titlePreview, lesson };
}
