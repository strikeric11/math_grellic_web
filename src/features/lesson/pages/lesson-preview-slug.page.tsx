import { BaseScene } from '#/base/components/base-scene.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { useLessonPreviewSlug } from '../hooks/use-lesson-preview-slug.hook';
import { LessonStudentSingle } from '../components/lesson-student-single.component';

export function LessonPreviewSlugPage() {
  const { titlePreview, lesson } = useLessonPreviewSlug();

  if (lesson === undefined) {
    return <BasePageSpinner />;
  }

  return !lesson ? (
    <div className='w-full pt-8 text-center'>Lesson preview has expired.</div>
  ) : (
    <BaseScene title={titlePreview} breadcrumbsHidden isClose>
      <LessonStudentSingle lesson={lesson} preview />
    </BaseScene>
  );
}
