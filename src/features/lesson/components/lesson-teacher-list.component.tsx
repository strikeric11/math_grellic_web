import { memo } from 'react';
import cx from 'classix';

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
    <div className={cx(className, '')} {...moreProps}>
      {lessons.map((lesson) => (
        <div>{lesson.title}</div>
      ))}
    </div>
  );
});
