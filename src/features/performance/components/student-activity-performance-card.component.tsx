import { memo, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { performanceDetailsAnimation } from '#/utils/animation.util';
import { generateOrdinalSuffix } from '#/utils/string.util';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { StudentPerformanceType } from '../models/performance.model';
import { PerformanceRankAwardImg } from './performance-rank-award-img.component';
import { StudentActivityPerformanceList } from './student-activity-performance-list.component';
import { TeacherStudentActivityPerformanceList } from './teacher-student-activity-performance-list.component';
import { StudentActivityPerformanceResult } from './student-activity-performance-result.component';
import { TeacherStudentActivityPerformanceResult } from './teacher-student-activity-performance-result.component';

import type { ComponentProps } from 'react';
import type { Activity } from '#/activity/models/activity.model';
import type { StudentPerformance } from '../models/performance.model';

type Props = ComponentProps<typeof BaseSurface> & {
  student: StudentPerformance;
  isStudent?: boolean;
};

const ACTIVITY_WRAPPER_CLASSNAME = 'flex flex-col items-center w-40';
const ACTIVITY_VALUE_CLASSNAME = 'text-2xl font-bold text-primary-hue-teal';

export const StudentActivityPerformanceCard = memo(function ({
  student,
  isStudent,
  ...moreProps
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

  const [
    totalActivityCount,
    activitiesCompletedCount,
    overallActivityCompletionPercent,
    overallActivityRank,
  ] = useMemo(
    () => [
      student.totalActivityCount,
      student.activitiesCompletedCount,
      student.overallActivityCompletionPercent,
      student.overallActivityRank,
    ],
    [student],
  );

  const overallActivityRankText = useMemo(
    () =>
      overallActivityRank == null
        ? '-'
        : generateOrdinalSuffix(overallActivityRank),
    [overallActivityRank],
  );

  const handleActivityClick = useCallback(
    (isOpen: boolean) => (activity?: Activity) => {
      setCurrentActivity(activity || null);
      setOpenModal(isOpen);
    },
    [],
  );

  const handleOpenDetails = useCallback(
    () => setOpenDetails((prev) => !prev),
    [],
  );

  return (
    <>
      <BaseSurface rounded='sm' {...moreProps}>
        <div className='mb-2.5 flex w-full items-center justify-between'>
          <h3 className='text-base'>Activities</h3>
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
            <div className='flex items-center justify-center gap-5 font-bold text-primary-hue-teal'>
              <div className='flex items-center gap-x-2.5'>
                <span className='text-4xl'>{overallActivityRankText}</span>
                {overallActivityRank != null && overallActivityRank <= 10 && (
                  <PerformanceRankAwardImg rank={overallActivityRank} />
                )}
              </div>
            </div>
            <BaseProgressCircle
              percent={overallActivityCompletionPercent}
              performance={StudentPerformanceType.Activity}
              label='Overall Completion'
            />
          </div>
          <BaseDivider className='hidden !h-auto md:block' vertical />
          <BaseDivider className='block md:hidden' />
          <div className='flex flex-1 flex-col items-center justify-center font-medium'>
            <div className='flex w-fit flex-col gap-y-4 -3xs:flex-row md:flex-col'>
              <div className={ACTIVITY_WRAPPER_CLASSNAME}>
                <span className={ACTIVITY_VALUE_CLASSNAME}>
                  {totalActivityCount}
                </span>
                <span>Total Activities</span>
              </div>
              <div className={ACTIVITY_WRAPPER_CLASSNAME}>
                <span className={ACTIVITY_VALUE_CLASSNAME}>
                  {activitiesCompletedCount}
                </span>
                <span className='text-center'>Activities Completed</span>
              </div>
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
                <StudentActivityPerformanceList
                  onActivityClick={handleActivityClick(true)}
                />
              ) : (
                <TeacherStudentActivityPerformanceList
                  onActivityClick={handleActivityClick(true)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </BaseSurface>
      <BaseModal open={openModal} onClose={handleActivityClick(false)}>
        {currentActivity &&
          (isStudent ? (
            <StudentActivityPerformanceResult slug={currentActivity.slug} />
          ) : (
            <TeacherStudentActivityPerformanceResult
              slug={currentActivity.slug}
            />
          ))}
      </BaseModal>
    </>
  );
});
