import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';

import { useStudentActivitySingle } from '../hooks/use-student-activity-single.hook';
import { StudentActivitySingle } from '../components/student-activity-single.component';

export function StudentActivitySinglePage() {
  const { loading, title, activity } = useStudentActivitySingle();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene title={title}>
        {activity && (
          <StudentActivitySingle
            className='mx-auto py-5'
            activity={activity}
            loading={loading}
          />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
