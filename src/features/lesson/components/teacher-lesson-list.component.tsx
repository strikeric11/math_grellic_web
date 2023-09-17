import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import {
  TeacherLessonSingleCard,
  TeacherLessonSingleCardSkeleton,
} from './teacher-lesson-single-card.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '../models/lesson.model';

type Props = ComponentProps<'div'> & {
  lessons: Lesson[];
  loading?: boolean;
  onLessonPreview?: (slug: string) => void;
  onLessonDetails?: (slug: string) => void;
  onLessonEdit?: (slug: string) => void;
  onLessonSchedule?: (slug: string) => void;
};

export const TeacherLessonList = memo(function ({
  className,
  lessons,
  loading,
  onLessonPreview,
  onLessonDetails,
  onLessonEdit,
  onLessonSchedule,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => !lessons?.length, [lessons]);

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

  const handleLessonEdit = useCallback(
    (slug: string) => () => {
      onLessonEdit && onLessonEdit(slug);
    },
    [onLessonEdit],
  );

  const handleLessonSchedule = useCallback(
    (slug: string) => () => {
      onLessonSchedule && onLessonSchedule(slug);
    },
    [onLessonSchedule],
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
      {loading ? (
        [...Array(4)].map((_, index) => (
          <TeacherLessonSingleCardSkeleton key={index} />
        ))
      ) : isEmpty ? (
        <BaseDataEmptyMessage
          message='No lessons available'
          linkTo={teacherRoutes.lesson.createTo}
        />
      ) : (
        lessons.map((lesson) => (
          <TeacherLessonSingleCard
            key={lesson.id}
            lesson={lesson}
            onPreview={handleLessonPreview(lesson.slug)}
            onDetails={handleLessonDetails(lesson.slug)}
            onEdit={handleLessonEdit(lesson.slug)}
            onSchedule={handleLessonSchedule(lesson.slug)}
            role='row'
          />
        ))
      )}
    </div>
  );
});
