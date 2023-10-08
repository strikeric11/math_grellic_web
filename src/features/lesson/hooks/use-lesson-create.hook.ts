import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryLessonKey } from '#/config/react-query-keys.config';
import { createLesson as createLessonApi } from '../api/teacher-lesson.api';

import type { Lesson } from '../models/lesson.model';
import type { LessonUpsertFormData } from '../models/lesson-form-data.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createLesson: (data: LessonUpsertFormData) => Promise<Lesson>;
};

export function useLessonCreate(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: createLesson } = useMutation(
    createLessonApi({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryLessonKey.list,
        });
      },
    }),
  );

  return { isDone, setIsDone, createLesson };
}
