import { useLessonPreviewPage } from '#/lesson/hooks/use-lesson-preview.hook';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { LessonSingle } from '#/lesson/components/lesson-single.component';
import { BaseScene } from '#/base/components/base-scene.component';

export function LessonPreviewPage() {
  const { lesson, titlePreview } = useLessonPreviewPage();

  return lesson === undefined ? (
    <BasePageSpinner />
  ) : !lesson ? (
    <div className='w-full pt-8 text-center'>Lesson preview has expired.</div>
  ) : (
    <BaseScene title={titlePreview} breadcrumbsHidden isClose>
      <LessonSingle lesson={lesson} />
    </BaseScene>
  );
}
