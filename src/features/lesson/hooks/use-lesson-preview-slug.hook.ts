import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { transformToLesson } from '../helpers/lesson-transform.helper';
import { getLessonBySlugAndCurrentTeacherUser } from '../api/teacher-lesson.api';

import type { Lesson } from '../models/lesson.model';

type Result = {
  titlePreview: string;
  lesson?: Lesson | null;
};

export function useLessonPreviewSlug(): Result {
  const { slug } = useParams();

  const { data: lesson } = useQuery(
    getLessonBySlugAndCurrentTeacherUser(
      { slug: slug || '', exclude: 'schedules' },
      {
        enabled: !!slug,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToLesson(data);
        },
      },
    ),
  );

  const titlePreview = useMemo(
    () => (lesson?.title ? `${lesson?.title} (Preview)` : 'Preview'),
    [lesson],
  );

  return { titlePreview, lesson };
}
