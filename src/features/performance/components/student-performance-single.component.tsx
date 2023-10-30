import { memo } from 'react';
import cx from 'classix';

import { BaseSurface } from '#/base/components/base-surface.component';
import { StudentExamPerformanceCard } from './student-exam-performance-card.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '../models/performance.model';

type Props = ComponentProps<'div'> & {
  student: StudentPerformance;
  isStudent?: boolean;
};

export const StudentPerformanceSingle = memo(function ({
  className,
  student,
  isStudent,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx('flex w-full flex-col gap-y-2.5', className)}
      {...moreProps}
    >
      <StudentExamPerformanceCard student={student} isStudent={isStudent} />
      <BaseSurface rounded='sm'>
        <h3 className='text-base'>Activities</h3>
      </BaseSurface>
    </div>
  );
});
