import { memo } from 'react';
import cx from 'classix';

import { LessonTeacherSingleCard } from './lesson-teacher-single-card.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '../models/lesson.model';

type Props = ComponentProps<'div'> & {
  lessons: Lesson[];
  onLessonPreview?: (slug: string) => void;
};

export const LessonTeacherList = memo(function ({
  className,
  lessons,
  onLessonPreview,
  ...moreProps
}: Props) {
  const handleLessonPreview = (slug: string) => () => {
    onLessonPreview && onLessonPreview(slug);
  };

  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      {...moreProps}
    >
      {lessons.map((lesson) => (
        <LessonTeacherSingleCard
          key={lesson.id}
          lesson={lesson}
          onPreview={handleLessonPreview(lesson.slug)}
        />
      ))}
    </div>
  );
});
