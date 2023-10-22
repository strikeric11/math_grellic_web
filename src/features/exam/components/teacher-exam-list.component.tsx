import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import {
  TeacherExamSingleCard,
  TeacherExamSingleCardSkeleton,
} from './teacher-exam-single-card.component';

import type { ComponentProps } from 'react';
import type { Exam } from '../models/exam.model';

type Props = ComponentProps<'div'> & {
  exams: Exam[];
  loading?: boolean;
  onExamPreview?: (slug: string) => void;
  onExamDetails?: (slug: string) => void;
  onExamEdit?: (slug: string) => void;
  onExamSchedule?: (slug: string) => void;
};

export const TeacherExamList = memo(function ({
  className,
  exams,
  loading,
  onExamPreview,
  onExamDetails,
  onExamEdit,
  onExamSchedule,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => !exams?.length, [exams]);

  const handleExamPreview = useCallback(
    (slug: string) => () => {
      onExamPreview && onExamPreview(slug);
    },
    [onExamPreview],
  );

  const handleExamDetails = useCallback(
    (slug: string) => () => {
      onExamDetails && onExamDetails(slug);
    },
    [onExamDetails],
  );

  const handleExamEdit = useCallback(
    (slug: string) => () => {
      onExamEdit && onExamEdit(slug);
    },
    [onExamEdit],
  );

  const handleExamSchedule = useCallback(
    (slug: string) => () => {
      onExamSchedule && onExamSchedule(slug);
    },
    [onExamSchedule],
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
          <TeacherExamSingleCardSkeleton key={index} />
        ))
      ) : isEmpty ? (
        <BaseDataEmptyMessage
          message='No exams available'
          linkTo={teacherRoutes.exam.createTo}
        />
      ) : (
        exams.map((exam) => (
          <TeacherExamSingleCard
            key={exam.id}
            exam={exam}
            onPreview={handleExamPreview(exam.slug)}
            onDetails={handleExamDetails(exam.slug)}
            onEdit={handleExamEdit(exam.slug)}
            onSchedule={handleExamSchedule(exam.slug)}
            role='row'
          />
        ))
      )}
    </div>
  );
});
