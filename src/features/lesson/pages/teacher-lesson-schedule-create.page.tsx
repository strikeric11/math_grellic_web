import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

import { LessonScheduleUpsertForm } from '../components/lesson-schedule-upsert-form.component';

import type { OutletContextType } from './teacher-lesson-schedule-list.page';

export function TeacherLessonScheduleCreatePage() {
  const { lesson } = useOutletContext<OutletContextType>();

  const lessonId = useMemo(() => lesson?.id, [lesson]);

  return (
    lessonId && (
      <div>
        <LessonScheduleUpsertForm
          lessonId={lessonId}
          onSubmit={() => null as any}
        />
      </div>
    )
  );
}
