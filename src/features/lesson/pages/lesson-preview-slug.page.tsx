import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useLessonPreviewSlug } from '../hooks/use-lesson-preview-slug.hook';
import { StudentLessonSingle } from '../components/student-lesson-single.component';

export function LessonPreviewSlugPage() {
  const { titlePreview, lesson } = useLessonPreviewSlug();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene title={titlePreview} breadcrumbsHidden isClose>
        {lesson && <StudentLessonSingle lesson={lesson} preview />}
      </BaseScene>
    </BaseDataSuspense>
  );
}
