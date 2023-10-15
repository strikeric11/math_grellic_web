import { BaseScene } from '#/base/components/base-scene.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { useExamPreview } from '../hooks/use-exam-preview.hook';
import { StudentExamTakeForm } from '../components/student-exam-take-form.component';
import { StudentExamTakeDone } from '../components/student-exam-take-done.component';

export function ExamPreviewPage() {
  const { isDone, setIsDone, titlePreview, exam, examCompletion, submitExam } =
    useExamPreview();

  if (exam === undefined) {
    return <BasePageSpinner />;
  }

  return !exam ? (
    <div className='w-full pt-8 text-center'>Exam preview has expired.</div>
  ) : (
    <BaseScene title={titlePreview} breadcrumbsHidden isClose>
      {examCompletion && isDone ? (
        <StudentExamTakeDone
          className='mx-auto max-w-screen-sm'
          exam={exam}
          examCompletion={examCompletion}
        />
      ) : (
        <StudentExamTakeForm
          className='flex-1 py-5'
          exam={exam}
          isDone={isDone}
          ongoingDuration={null}
          onSubmit={submitExam}
          onDone={setIsDone}
          preview
        />
      )}
    </BaseScene>
  );
}
