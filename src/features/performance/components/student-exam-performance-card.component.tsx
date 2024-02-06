import { memo, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { performanceDetailsAnimation } from '#/utils/animation.util';
import { generateOrdinalSuffix } from '#/utils/string.util';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { StudentPerformanceType } from '../models/performance.model';
import { PerformanceRankAwardImg } from './performance-rank-award-img.component';
import { TeacherStudentExamPerformanceList } from './teacher-student-exam-performance-list.component';
import { StudentExamPerformanceList } from './student-exam-performance-list.component';
import { TeacherStudentExamPerformanceResult } from './teacher-student-exam-performance-result.component';
import { StudentExamPerformanceResult } from './student-exam-performance-result.component';

import type { ComponentProps } from 'react';
import type { Exam } from '#/exam/models/exam.model';
import type { StudentPerformance } from '../models/performance.model';

type Props = ComponentProps<typeof BaseSurface> & {
  student: StudentPerformance;
  isStudent?: boolean;
};

const EXAM_WRAPPER_CLASSNAME = 'flex flex-col items-center w-36';
const EXAM_VALUE_CLASSNAME = 'text-2xl font-bold text-primary-hue-purple';

export const StudentExamPerformanceCard = memo(function ({
  student,
  isStudent,
  ...moreProps
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);

  const [
    currentExamCount,
    examsCompletedCount,
    examsPassedCount,
    examsFailedCount,
    examsExpiredCount,
    overallExamCompletionPercent,
    overallExamScore,
    overallExamRank,
  ] = useMemo(
    () => [
      // Exams
      student.currentExamCount,
      student.examsCompletedCount,
      student.examsPassedCount,
      student.examsFailedCount,
      student.examsExpiredCount,
      student.overallExamCompletionPercent,
      student.overallExamScore,
      student.overallExamRank,
    ],
    [student],
  );

  const overallExamRankText = useMemo(
    () =>
      overallExamRank == null ? '-' : generateOrdinalSuffix(overallExamRank),
    [overallExamRank],
  );

  const overallExamScoreText = useMemo(() => {
    if (overallExamScore == null) {
      return '';
    }

    const pointText = overallExamScore > 1 ? 'Points' : 'Point';

    return `${overallExamScore} ${pointText}`;
  }, [overallExamScore]);

  const handleExamClick = useCallback(
    (isOpen: boolean) => (exam?: Exam) => {
      setCurrentExam(exam || null);
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
          <h3 className='text-base'>Exams</h3>
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
          <div className='flex flex-1 flex-col items-center justify-center gap-y-8 '>
            <div className='flex items-center justify-center gap-5 font-bold text-primary-hue-purple'>
              <div className='flex items-center gap-x-2.5'>
                <span className='text-4xl'>{overallExamRankText}</span>
                {overallExamRank != null && overallExamRank <= 10 && (
                  <PerformanceRankAwardImg rank={overallExamRank} />
                )}
              </div>
              {!!overallExamScore && (
                <>
                  <BaseDivider className='!h-10' vertical />
                  <span className='font-display text-2xl tracking-tighter'>
                    {overallExamScoreText}
                  </span>
                </>
              )}
            </div>
            <BaseProgressCircle
              percent={overallExamCompletionPercent}
              performance={StudentPerformanceType.Exam}
              label='Overall Completion'
            />
          </div>
          <BaseDivider className='hidden !h-auto md:block' vertical />
          <BaseDivider className='block md:hidden' />
          <div className='flex flex-1 flex-col items-center justify-center font-medium'>
            <div className='grid w-fit grid-cols-1 gap-y-4 -3xs:grid-cols-2 -2xs:grid-cols-3 md:grid-cols-2'>
              <div className={EXAM_WRAPPER_CLASSNAME}>
                <span className={EXAM_VALUE_CLASSNAME}>{currentExamCount}</span>
                <span>Current Exams</span>
              </div>
              <div className={EXAM_WRAPPER_CLASSNAME}>
                <span className={EXAM_VALUE_CLASSNAME}>{examsPassedCount}</span>
                <span>Exams Passed</span>
              </div>
              <div className={EXAM_WRAPPER_CLASSNAME}>
                <span className={EXAM_VALUE_CLASSNAME}>
                  {examsCompletedCount}
                </span>
                <span>Exams Completed</span>
              </div>
              <div className={EXAM_WRAPPER_CLASSNAME}>
                <span className={EXAM_VALUE_CLASSNAME}>{examsFailedCount}</span>
                <span>Exams Failed</span>
              </div>
              <div className={EXAM_WRAPPER_CLASSNAME}>
                <span className={EXAM_VALUE_CLASSNAME}>
                  {examsExpiredCount}
                </span>
                <span>Exams Expired</span>
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
                <StudentExamPerformanceList
                  onExamClick={handleExamClick(true)}
                />
              ) : (
                <TeacherStudentExamPerformanceList
                  onExamClick={handleExamClick(true)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </BaseSurface>
      <BaseModal open={openModal} onClose={handleExamClick(false)}>
        {currentExam &&
          (isStudent ? (
            <StudentExamPerformanceResult slug={currentExam.slug} />
          ) : (
            <TeacherStudentExamPerformanceResult slug={currentExam.slug} />
          ))}
      </BaseModal>
    </>
  );
});
