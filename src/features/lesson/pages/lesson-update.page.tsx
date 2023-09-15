import { useCallback } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { LessonUpsertForm } from '../components/lesson-upsert-form.component';
import { useLessonUpdate } from '../hooks/use-lesson-update.hook';

import type { LessonUpsertFormData } from '../models/lesson.model';

export function LessonUpdatePage() {
  const { slug } = useParams();

  const { isDone, setIsDone, lessonFormData, updateLesson } =
    useLessonUpdate(slug);

  const data: any = useLoaderData();

  const handleUpdateLesson = useCallback(
    (data: LessonUpsertFormData) => updateLesson(slug || '', data),
    [slug, updateLesson],
  );

  return (
    <BaseDataSuspense resolve={data?.main}>
      <LessonUpsertForm
        isDone={isDone}
        onDone={setIsDone}
        lessonFormData={lessonFormData}
        onSubmit={handleUpdateLesson}
      />
    </BaseDataSuspense>
  );
}
