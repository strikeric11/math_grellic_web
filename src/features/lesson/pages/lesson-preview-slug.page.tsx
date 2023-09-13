import { useParams } from 'react-router-dom';

import { BaseScene } from '#/base/components/base-scene.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { useLessonPreviewSlug } from '../hooks/use-lesson-preview-slug.hook';
import { LessonSingle } from '../components/lesson-single.component';

export function LessonPreviewSlugPage() {
  const { slug } = useParams();
  const { titlePreview, lesson } = useLessonPreviewSlug(slug);

  return lesson === undefined ? (
    <BasePageSpinner />
  ) : !lesson ? (
    <div className='w-full pt-8 text-center'>Lesson preview has expired.</div>
  ) : (
    <BaseScene title={titlePreview} breadcrumbsHidden isClose>
      <LessonSingle lesson={lesson} preview />
    </BaseScene>
  );
}
