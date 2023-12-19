import { useExamCreate } from '../hooks/use-exam-create.hook';
import { ExamUpsertForm } from '../components/exam-upsert-form.component';

export function ExamCreatePage() {
  const { loading, isDone, setIsDone, createExam } = useExamCreate();

  return (
    <ExamUpsertForm
      loading={loading}
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={createExam}
    />
  );
}
