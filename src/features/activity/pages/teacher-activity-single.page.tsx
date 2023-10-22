import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { useTeacherActivitySingle } from '../hooks/use-teacher-activity-single.hook';
import { TeacherActivitySingle } from '../components/teacher-activity-single.component';

export function TeacherActivitySinglePage() {
  const { activity } = useTeacherActivitySingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      {activity && (
        <TeacherActivitySingle
          className='mx-auto max-w-compact py-5'
          activity={activity}
        />
      )}
    </BaseDataSuspense>
  );
}
