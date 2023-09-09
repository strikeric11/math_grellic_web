import { LessonUpsertForm } from '../components/lesson-upsert-form.component';
import { useLessonUpsert } from '../hooks/use-lesson-upsert.hook';

export function LessonCreatePage() {
  const { isDone, setIsDone, createLesson } = useLessonUpsert();

  return (
    <LessonUpsertForm
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={createLesson}
    />
  );
}
