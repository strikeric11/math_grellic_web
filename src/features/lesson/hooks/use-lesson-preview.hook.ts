import { useMemo } from 'react';

import { useBoundStore } from '#/core/hooks/use-store.hook';

import type { Lesson } from '../models/lesson.model';
import { convertDurationToSeconds } from '#/utils/time.util';

type Result = {
  titlePreview: string;
  lesson?: Lesson | null;
};

export function useLessonPreview(): Result {
  const lessonFormData = useBoundStore((state) => state.lessonFormData);

  const lesson = useMemo(() => {
    if (!lessonFormData) {
      return lessonFormData;
    }

    const { duration, ...moreLessonFormData } = lessonFormData;

    return {
      ...moreLessonFormData,
      durationSeconds: convertDurationToSeconds(duration || '0'),
      id: 0,
    } as Lesson;
  }, [lessonFormData]);

  const titlePreview = useMemo(
    () => (lesson?.title ? `${lesson?.title} (Preview)` : 'Preview'),
    [lesson],
  );

  return { titlePreview, lesson };
}
