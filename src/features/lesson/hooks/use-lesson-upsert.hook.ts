import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryKey } from '#/config/react-query-key.config';
import { createLesson as createLessonApi } from '../api/lesson-teacher.api';

import type { Lesson, LessonUpsertFormData } from '../models/lesson.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createLesson: (data: LessonUpsertFormData) => Promise<Lesson>;
};

export function useLessonUpsert(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: createLesson } = useMutation(
    createLessonApi({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKey.lessons.list.queryKey,
        });
      },
    }),
  );

  return { isDone, setIsDone, createLesson };
}
