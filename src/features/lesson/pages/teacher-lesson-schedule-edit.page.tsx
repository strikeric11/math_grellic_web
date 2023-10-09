import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

import { transformToLessonScheduleFormData } from '../helpers/lesson-transform.helper';
import { useLessonScheduleUpsert } from '../hooks/use-lesson-schedule-upsert.hook';
import { LessonScheduleUpsertForm } from '../components/lesson-schedule-upsert-form.component';

import type { OutletContextType } from './teacher-lesson-schedule-list.page';

export function TeacherLessonScheduleEditPage() {
  const { lesson, lessonSchedule } = useOutletContext<OutletContextType>();

  const { isDone, setIsDone, editLessonSchedule } = useLessonScheduleUpsert(
    lessonSchedule?.id,
  );

  const lessonId = useMemo(() => lesson?.id, [lesson]);

  const lessonScheduleFormData = useMemo(
    () =>
      lessonSchedule
        ? transformToLessonScheduleFormData({ ...lessonSchedule, lesson })
        : undefined,
    [lesson, lessonSchedule],
  );

  return (
    lessonId &&
    lessonScheduleFormData && (
      <LessonScheduleUpsertForm
        lessonId={lessonId}
        formData={lessonScheduleFormData}
        isDone={isDone}
        onDone={setIsDone}
        onSubmit={editLessonSchedule}
      />
    )
  );
}
