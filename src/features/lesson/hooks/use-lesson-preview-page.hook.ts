import { useMemo } from 'react';

import { useBoundStore } from '#/core/hooks/use-store.hook';

import type { Lesson } from '../models/lesson.model';

type Result = {
  titlePreview: string;
  lesson?: Lesson | null;
};

export function useLessonPreviewPage(): Result {
  const lessonFormData = useBoundStore((state) => state.lessonFormData);

  const lesson = useMemo(() => {
    if (!lessonFormData) {
      return lessonFormData;
    }
    return { ...lessonFormData, id: 0 } as Lesson;
  }, [lessonFormData]);

  const titlePreview = useMemo(
    () => (lesson?.title ? `${lesson?.title} (Preview)` : 'Preview'),
    [lesson],
  );

  return { titlePreview, lesson };
}
