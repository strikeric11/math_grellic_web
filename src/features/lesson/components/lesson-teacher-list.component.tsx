import { memo, useCallback } from 'react';
import cx from 'classix';

import {
  LessonTeacherSingleCard,
  LessonTeacherSingleCardSkeleton,
} from './lesson-teacher-single-card.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '../models/lesson.model';

type Props = ComponentProps<'div'> & {
  lessons: Lesson[];
  loading?: boolean;
  onLessonPreview?: (slug: string) => void;
  onLessonDetails?: (slug: string) => void;
  onLessonUpdate?: (slug: string) => void;
};

export const LessonTeacherList = memo(function ({
  className,
  lessons,
  loading,
  onLessonPreview,
  onLessonDetails,
  onLessonUpdate,
  ...moreProps
}: Props) {
  const handleLessonPreview = useCallback(
    (slug: string) => () => {
      onLessonPreview && onLessonPreview(slug);
    },
    [onLessonPreview],
  );

  const handleLessonDetails = useCallback(
    (slug: string) => () => {
      onLessonDetails && onLessonDetails(slug);
    },
    [onLessonDetails],
  );

  const handleLessonUpdate = useCallback(
    (slug: string) => () => {
      onLessonUpdate && onLessonUpdate(slug);
    },
    [onLessonUpdate],
  );

  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      role='table'
      {...moreProps}
    >
      {loading
        ? [...Array(4)].map((_, index) => (
            <LessonTeacherSingleCardSkeleton key={index} />
          ))
        : lessons.map((lesson) => (
            <LessonTeacherSingleCard
              key={lesson.id}
              lesson={lesson}
              onPreview={handleLessonPreview(lesson.slug)}
              onDetails={handleLessonDetails(lesson.slug)}
              onUpdate={handleLessonUpdate(lesson.slug)}
              role='row'
            />
          ))}
    </div>
  );
});
