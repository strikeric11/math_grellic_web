import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getLessonBySlugAndCurrentTeacherUser } from '../api/teacher-lesson.api';
import { transformToLesson } from '../helpers/lesson-transform.helper';

import type { Lesson } from '../models/lesson.model';

type Result = {
  title?: string;
  lesson?: Lesson | null;
};

export function useTeacherLessonSingle(): Result {
  const { slug } = useParams();

  const { data: lesson } = useQuery(
    getLessonBySlugAndCurrentTeacherUser(
      { slug: slug || '' },
      {
        enabled: !!slug,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToLesson(data);
        },
      },
    ),
  );

  const title = useMemo(() => lesson?.title, [lesson]);

  return { title, lesson };
}
