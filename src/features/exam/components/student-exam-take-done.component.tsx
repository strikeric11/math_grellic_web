import { memo, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import cx from 'classix';

import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';

import type { ComponentProps } from 'react';
import type { Exam, ExamCompletion } from '../models/exam.model';

type Props = ComponentProps<'div'> & {
  exam: Exam;
  examCompletion: ExamCompletion;
  loading?: boolean;
};

const FIELD_WRAPPER_CLASSNAME = 'flex flex-col items-center gap-1.5';
const FIELD_VALUE_CLASSNAME = 'text-xl leading-none';
const FIELD_LABEL_CLASSNAME = 'uppercase';

const scoreShowVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.5,
    },
  },
};

const scoreShowItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export const StudentExamTakeDone = memo(function ({
  className,
  exam,
  examCompletion,
  loading,
  ...moreProps
}: Props) {
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLocalLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const [title, orderNumber, totalPoints, passingPoints] = useMemo(
    () => [
      exam.title,
      exam.orderNumber,
      exam.questions.length * exam.visibleQuestionsCount,
      exam.passingPoints,
    ],
    [exam],
  );

  const totalPointsLabel = useMemo(
    () => `Total ${totalPoints > 1 ? 'Points' : 'Point'}`,
    [totalPoints],
  );

  const passingPointsLabel = useMemo(
    () => `Passing ${passingPoints > 1 ? 'Points' : 'Point'}`,
    [passingPoints],
  );

  const score = useMemo(() => examCompletion.score, [examCompletion]);

  const hasPassed = useMemo(
    () => score >= passingPoints,
    [score, passingPoints],
  );

  return (
    <div className={cx('w-full p-1.5', className)} {...moreProps}>
      <div className='mb-5 flex items-center gap-x-2.5 text-primary'>
        <BaseIcon name='check-circle' size={36} weight='bold' />
        <h1 className='text-2xl'>Exam completed!</h1>
      </div>
      <div className='mb-12 flex items-center gap-x-4 px-2.5'>
        <div>
          <BaseChip iconName='exam'>Exam {orderNumber}</BaseChip>
          <h2 className='font-body text-lg font-medium tracking-normal text-accent'>
            {title}
          </h2>
        </div>
        <BaseDivider className='!h-12' vertical />
        <div className={FIELD_WRAPPER_CLASSNAME}>
          <span className={FIELD_VALUE_CLASSNAME}>{totalPoints}</span>
          <small className={FIELD_LABEL_CLASSNAME}>{totalPointsLabel}</small>
        </div>
        <BaseDivider className='!h-12' vertical />
        <div className={FIELD_WRAPPER_CLASSNAME}>
          <span className={FIELD_VALUE_CLASSNAME}>{passingPoints}</span>
          <small className={FIELD_LABEL_CLASSNAME}>{passingPointsLabel}</small>
        </div>
      </div>
      <BaseSurface className='flex min-h-[220px] flex-col items-center !py-8'>
        {localLoading || loading ? (
          <div className='flex h-full w-full flex-1 items-center justify-center'>
            <BaseSpinner />
          </div>
        ) : (
          <motion.div
            className='flex h-full w-full flex-col items-center'
            variants={scoreShowVariants}
            initial='hidden'
            animate='show'
          >
            <motion.div
              className='mb-5 flex w-full flex-col items-center text-primary'
              variants={scoreShowItemVariants}
            >
              <span className='text-7xl font-medium'>{score}</span>
              <small className={FIELD_LABEL_CLASSNAME}>Your Score</small>
            </motion.div>
            {hasPassed ? (
              <motion.div
                className='flex items-center gap-x-2.5 text-green-500'
                variants={scoreShowItemVariants}
              >
                <BaseIcon name='check-circle' size={40} weight='bold' />
                <h2 className='text-3xl text-green-500'>
                  You've Passed the Exam
                </h2>
              </motion.div>
            ) : (
              <motion.div
                className='flex items-center gap-x-2.5 text-red-500'
                variants={scoreShowItemVariants}
              >
                <BaseIcon name='x-circle' size={40} weight='bold' />
                <h2 className='text-3xl text-red-500'>
                  You've Failed the Exam
                </h2>
              </motion.div>
            )}
          </motion.div>
        )}
      </BaseSurface>
    </div>
  );
});

{
  /* <motion.div
  initial="hidden"
  animate="visible"
  variants={divVariants}
  staggerChildren={0.2} // Adjust the stagger delay as needed
> */
}
{
  /* Your three div elements */
}
//   <motion.div className="your-div-class">Div 1</motion.div>
//   <motion.div className="your-div-class">Div 2</motion.div>
//   <motion.div className="your-div-class">Div 3</motion.div>
// </motion.div>
