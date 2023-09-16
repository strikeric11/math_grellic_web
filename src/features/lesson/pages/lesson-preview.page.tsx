import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { BaseScene } from '#/base/components/base-scene.component';
import { useLessonPreview } from '../hooks/use-lesson-preview.hook';
import { StudentLessonSingle } from '../components/student-lesson-single.component';

export function LessonPreviewPage() {
  const { titlePreview, lesson } = useLessonPreview();

  if (lesson === undefined) {
    return <BasePageSpinner />;
  }

  return !lesson ? (
    <div className='w-full pt-8 text-center'>Lesson preview has expired.</div>
  ) : (
    <BaseScene title={titlePreview} breadcrumbsHidden isClose>
      <StudentLessonSingle lesson={lesson} preview />
    </BaseScene>
  );
}
