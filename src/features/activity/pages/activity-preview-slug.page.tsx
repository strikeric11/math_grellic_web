import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useActivityPreviewSlug } from '../hooks/use-activity-preview-slug.hook';
import { StudentActivitySingle } from '../components/student-activity-single.component';

export function ActivityPreviewSlugPage() {
  const { isDone, setIsDone, titlePreview, activity } =
    useActivityPreviewSlug();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene title={titlePreview} breadcrumbsHidden isClose>
        {activity && (
          <StudentActivitySingle className='mx-auto py-5' activity={activity} />
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}
