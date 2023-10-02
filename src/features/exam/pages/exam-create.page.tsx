import { useExamCreate } from '../hooks/use-exam-create.hook';
import { ExamUpsertForm } from '../components/exam-upsert-form.component';

export function ExamCreatePage() {
  const { isDone, setIsDone, createExam } = useExamCreate();

  return (
    <ExamUpsertForm isDone={isDone} onDone={setIsDone} onSubmit={createExam} />
  );
}
