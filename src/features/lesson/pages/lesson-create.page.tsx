import { LessonUpsertForm } from '../components/lesson-upsert-form.component';
import { useLessonCreate } from '../hooks/use-lesson-create.hook';

export function LessonCreatePage() {
  const { isDone, setIsDone, createLesson } = useLessonCreate();

  return (
    <LessonUpsertForm
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={createLesson}
    />
  );
}
