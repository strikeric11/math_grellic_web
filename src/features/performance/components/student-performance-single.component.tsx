import { memo } from 'react';
import cx from 'classix';

import { StudentExamPerformanceCard } from './student-exam-performance-card.component';
import { StudentActivityPerformanceCard } from './student-activity-performance-card.component';
import { StudentLessonPerformanceCard } from './student-lesson-performance-card.component';

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
      <StudentActivityPerformanceCard
        className='min-h-[280px]'
        student={student}
        isStudent={isStudent}
      />
      <StudentLessonPerformanceCard
        className='min-h-[280px]'
        student={student}
        isStudent={isStudent}
      />
    </div>
  );
});
