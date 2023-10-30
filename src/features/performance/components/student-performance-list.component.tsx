import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import { StudentPerformanceType } from '../models/performance.model';
import {
  StudentPerformanceSingleCard,
  StudentPerformanceSingleCardSkeleton,
} from './student-performance-single-card.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '../models/performance.model';

type Props = ComponentProps<'div'> & {
  students: StudentPerformance[];
  performance: StudentPerformanceType;
  loading?: boolean;
  onPerformanceDetails?: (publicId: string) => void;
};

export const StudentPerformanceList = memo(function ({
  className,
  loading,
  students,
  performance,
  onPerformanceDetails,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => !students?.length, [students]);

  const handlePerformanceDetails = useCallback(
    (publicId?: string) => () => {
      if (!publicId) {
        return;
      }

      onPerformanceDetails && onPerformanceDetails(publicId);
    },
    [onPerformanceDetails],
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
          <StudentPerformanceSingleCardSkeleton key={index} />
        ))
      ) : isEmpty ? (
        <BaseDataEmptyMessage
          message='No students available'
          linkTo={teacherRoutes.student.to}
          linkLabel='View All Students'
        />
      ) : (
        students.map((student) => (
          <StudentPerformanceSingleCard
            key={student.publicId?.toLowerCase()}
            student={student}
            performance={performance}
            onDetails={handlePerformanceDetails(student.publicId)}
            role='row'
          />
        ))
      )}
    </div>
  );
});
