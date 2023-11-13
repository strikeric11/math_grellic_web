import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import {
  StudentUserSingleCard,
  StudentUserSingleCardSkeleton,
} from '#/performance/components/student-user-single-card.component';

import type { ComponentProps } from 'react';
import type { StudentUserAccount } from '../models/user.model';

type Props = ComponentProps<'div'> & {
  students: StudentUserAccount[];
  loading?: boolean;
  onStudentDetails?: (publicId: string) => void;
  onStudentEdit?: (publicId: string) => void;
};

export const StudentUserList = memo(function ({
  className,
  students,
  loading,
  onStudentDetails,
  onStudentEdit,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => !students?.length, [students]);

  const handleStudentDetails = useCallback(
    (publicId?: string) => () => {
      !!publicId && onStudentDetails && onStudentDetails(publicId);
    },
    [onStudentDetails],
  );

  const handleStudentEdit = useCallback(
    (publicId?: string) => () => {
      !!publicId && onStudentEdit && onStudentEdit(publicId);
    },
    [onStudentEdit],
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
          <StudentUserSingleCardSkeleton key={index} />
        ))
      ) : isEmpty ? (
        <BaseDataEmptyMessage
          message='No students available'
          linkTo={teacherRoutes.exam.createTo}
        />
      ) : (
        students.map((student, index) => (
          <StudentUserSingleCard
            key={`s-${student.publicId?.toLowerCase() || index}`}
            student={student}
            onDetails={handleStudentDetails(student.publicId)}
            onEdit={handleStudentEdit(student.publicId)}
            role='row'
          />
        ))
      )}
    </div>
  );
});
