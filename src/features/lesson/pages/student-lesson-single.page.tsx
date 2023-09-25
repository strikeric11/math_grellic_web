import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useStudentLessonSingle } from '../hooks/use-student-lesson-single.hook';
import { StudentLessonSingle } from '../components/student-lesson-single.component';

export function StudentLessonSinglePage() {
  const { loading, title, lesson, upcomingDayJsDuration, setLessonCompletion } =
    useStudentLessonSingle();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene title={title}>
        {lesson && (
          <StudentLessonSingle
            loading={loading}
            lesson={lesson}
            upcomingDuration={upcomingDayJsDuration}
            onSetCompletion={setLessonCompletion}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
