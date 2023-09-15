import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { useLessonTeacherSingle } from '../hooks/use-lesson-teacher-single.hook';
import { LessonTeacherSingle } from '../components/lesson-teacher-single.component';

export function LessonTeacherSinglePage() {
  const { lesson } = useLessonTeacherSingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      {lesson && (
        <LessonTeacherSingle
          className='mx-auto max-w-compact py-4'
          lesson={lesson}
        />
      )}
    </BaseDataSuspense>
  );
}
