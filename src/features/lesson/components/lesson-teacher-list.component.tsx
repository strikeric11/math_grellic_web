import { memo } from 'react';
import cx from 'classix';

import { LessonTeacherSingleCard } from './lesson-teacher-single-card.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '../models/lesson.model';

type Props = ComponentProps<'div'> & {
  lessons: Lesson[];
};

export const LessonTeacherList = memo(function ({
  className,
  lessons,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx('flex w-full flex-col gap-2.5', className)}
      {...moreProps}
    >
      {lessons.map((lesson) => (
        <LessonTeacherSingleCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
});
