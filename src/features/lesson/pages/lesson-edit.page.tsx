import { useCallback } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { LessonUpsertForm } from '../components/lesson-upsert-form.component';
import { useLessonEdit } from '../hooks/use-lesson-edit.hook';

import type { LessonUpsertFormData } from '../models/lesson.model';

export function LessonEditPage() {
  const { slug } = useParams();

  const { isDone, setIsDone, lessonFormData, editLesson } = useLessonEdit(slug);

  const data: any = useLoaderData();

  const handleEditLesson = useCallback(
    (data: LessonUpsertFormData) => editLesson(slug || '', data),
    [slug, editLesson],
  );

  return (
    <BaseDataSuspense resolve={data?.main}>
      <LessonUpsertForm
        isDone={isDone}
        onDone={setIsDone}
        lessonFormData={lessonFormData}
        onSubmit={handleEditLesson}
      />
    </BaseDataSuspense>
  );
}
