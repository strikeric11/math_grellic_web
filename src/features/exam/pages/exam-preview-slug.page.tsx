import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useExamPreviewSlug } from '../hooks/use-exam-preview-slug.hook';
import { StudentExamTakeDone } from '../components/student-exam-take-done.component';
import { StudentExamTakeForm } from '../components/student-exam-take-form.component';

export function ExamPreviewSlugPage() {
  const { isDone, setIsDone, titlePreview, exam, examCompletion, submitExam } =
    useExamPreviewSlug();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene title={titlePreview} breadcrumbsHidden isClose>
        {exam &&
          (examCompletion && isDone ? (
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
              onSubmit={submitExam}
              onDone={setIsDone}
              ongoingDuration={null}
              preview
            />
          ))}
      </BaseScene>
    </BaseDataSuspense>
  );
}
