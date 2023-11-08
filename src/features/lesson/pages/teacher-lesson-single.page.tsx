import { useLoaderData } from 'react-router-dom';

import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { useTeacherLessonSingle } from '../hooks/use-teacher-lesson-single.hook';
import { TeacherLessonSingle } from '../components/teacher-lesson-single.component';

export function TeacherLessonSinglePage() {
  const { lesson, loading } = useTeacherLessonSingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading && <BasePageSpinner />}
      {lesson && (
        <TeacherLessonSingle
          className='mx-auto max-w-compact py-5'
          lesson={lesson}
        />
      )}
    </BaseDataSuspense>
  );
}
