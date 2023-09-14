import { BaseScene } from '#/base/components/base-scene.component';
import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { useLessonTeacherSingle } from '../hooks/use-lesson-teacher-single.hook';

export function LessonTeacherSinglePage() {
  const { title, lesson } = useLessonTeacherSingle();

  if (lesson === undefined) {
    <BasePageSpinner />;
  }

  return !lesson ? (
    <div className='w-full pt-8 text-center'>Lesson preview has expired.</div>
  ) : (
    <BaseScene title={title}>
      {/* <LessonSingle lesson={lesson} preview /> */}
    </BaseScene>
  );
}
