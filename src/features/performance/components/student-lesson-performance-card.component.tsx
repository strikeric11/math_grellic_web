import { memo, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { performanceDetailsAnimation } from '#/utils/animation.util';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { StudentPerformanceType } from '../models/performance.model';
import { TeacherStudentLessonPerformanceList } from './teacher-student-lesson-performance-list.component';
import { StudentLessonPerformanceList } from './student-lesson-performance-list.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '../models/performance.model';

type Props = ComponentProps<typeof BaseSurface> & {
  student: StudentPerformance;
  isStudent?: boolean;
};

const LESSON_WRAPPER_CLASSNAME = 'flex flex-col items-center w-40';
const LESSON_VALUE_CLASSNAME = 'text-2xl font-bold text-primary';

export const StudentLessonPerformanceCard = memo(function ({
  student,
  isStudent,
  ...moreProps
}: Props) {
  const [openDetails, setOpenDetails] = useState(false);

  const [
    totalLessonCount,
    currentLessonCount,
    lessonsCompletedCount,
    overallLessonCompletionPercent,
  ] = useMemo(
    () => [
      student.totalLessonCount,
      student.currentLessonCount,
      student.lessonsCompletedCount,
      student.overallLessonCompletionPercent,
    ],
    [student],
  );

  const overallLessonScoreText = useMemo(() => {
    if (isStudent) {
      return `${lessonsCompletedCount} Completed`;
    } else {
      return `${lessonsCompletedCount}/${totalLessonCount} Completed`;
    }
  }, [lessonsCompletedCount, totalLessonCount, isStudent]);

  const handleOpenDetails = useCallback(
    () => setOpenDetails((prev) => !prev),
    [],
  );

  return (
    <BaseSurface rounded='sm' {...moreProps}>
      <div className='mb-2.5 flex w-full items-center justify-between'>
        <h3 className='text-base'>Lessons</h3>
        <BaseButton
          rightIconName='subtract-square'
          variant='link'
          size='sm'
          onClick={handleOpenDetails}
        >
          {openDetails ? 'Less' : 'More'} Details
        </BaseButton>
      </div>
      <div className='flex min-h-[200px] w-full flex-col items-stretch gap-5 md:flex-row md:gap-0'>
        <div className='flex flex-1 flex-col items-center justify-center gap-y-8'>
          <div className='flex items-center justify-center gap-5 font-bold text-primary'>
            <span className='font-display text-xl tracking-tighter'>
              {overallLessonScoreText}
            </span>
          </div>
          <BaseProgressCircle
            percent={overallLessonCompletionPercent}
            performance={StudentPerformanceType.Lesson}
            label='Overall Completion'
          />
        </div>
        <BaseDivider className='hidden !h-auto md:block' vertical />
        <BaseDivider className='block md:hidden' />
        <div className='flex flex-1 flex-col items-center justify-center font-medium'>
          <div className='flex w-fit grid-cols-2 flex-col gap-y-4 -3xs:grid -3xs:flex-row xs:flex md:flex-col'>
            <div className={LESSON_WRAPPER_CLASSNAME}>
              <span className={LESSON_VALUE_CLASSNAME}>
                {currentLessonCount}
              </span>
              <span>Current Lessons</span>
            </div>
            <div className={LESSON_WRAPPER_CLASSNAME}>
              <span className={LESSON_VALUE_CLASSNAME}>
                {lessonsCompletedCount}
              </span>
              <span>Lessons Completed</span>
            </div>
            {!isStudent && (
              <div className={LESSON_WRAPPER_CLASSNAME}>
                <span className={LESSON_VALUE_CLASSNAME}>
                  {totalLessonCount}
                </span>
                <span>Total Lessons</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {openDetails && (
          <motion.div
            className='overflow-hidden pt-8'
            {...performanceDetailsAnimation}
          >
            <BaseDivider className='mb-2.5' />
            {isStudent ? (
              <StudentLessonPerformanceList />
            ) : (
              <TeacherStudentLessonPerformanceList />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </BaseSurface>
  );
});
