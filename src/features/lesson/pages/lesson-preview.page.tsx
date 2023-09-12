import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useLessonPreviewPage } from '../hooks/use-lesson-preview-page.hook';
import { LessonSingle } from '../components/lesson-single.component';

export function LessonPreviewPage() {
  const { titlePreview, lesson } = useLessonPreviewPage();

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
