import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import {
  StudentExamSingleCardSkeleton,
  StudentExamSingleCard,
} from '#/exam/components/student-exam-single-card.component';

import type { ComponentProps } from 'react';
import type { Exam, ExamWithDuration } from '#/exam/models/exam.model';

type Props = ComponentProps<'div'> & {
  latestExam: Exam | null;
  upcomingExamWithDuration: ExamWithDuration;
  ongoingExamsWithDurations: ExamWithDuration[];
  previousExams: Exam[];
  loading?: boolean;
};

const EXAM_LIST_PATH = `/${studentBaseRoute}/${studentRoutes.exam.to}`;

const ExamCompactCard = memo(function ({ exam }: { exam: Exam }) {
  const [singleTo, orderNumber, title, totalPoints, score] = useMemo(
    () => [
      `${EXAM_LIST_PATH}/${exam.slug}`,
      exam.orderNumber,
      exam.title,
      exam.pointsPerQuestion * exam.visibleQuestionsCount,
      !exam.completions?.length ? null : exam.completions[0].score,
    ],
    [exam],
  );

  const totalPointsText = useMemo(
    () =>
      totalPoints > 1
        ? `${totalPoints} Total Points`
        : `${totalPoints} Total Point`,
    [totalPoints],
  );

  return (
    <Link to={singleTo} className='group'>
      <BaseSurface className='flex items-start rounded-lg !p-2.5 transition-all group-hover:-translate-y-1 group-hover:ring-1'>
        <div className='flex w-full flex-col gap-2.5'>
          <div className='flex items-center gap-2.5'>
            <BaseChip iconName='exam' className='text-sm'>
              Exam {orderNumber}
            </BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='list-numbers' className='text-sm'>
              {totalPointsText}
            </BaseChip>
          </div>
          <h2 className='flex-1 pl-1 font-body text-base font-medium tracking-normal text-accent [.primary_&]:text-white'>
            {title}
          </h2>
        </div>
        <div className='flex justify-center'>
          {score == null ? (
            <BaseIcon
              name='x-circle'
              weight='fill'
              size={30}
              className='relative z-10 text-red-500'
            />
          ) : (
            <div className='relative flex items-center justify-center'>
              <BaseIcon
                name='check-circle'
                weight='fill'
                className='relative z-10 text-green-500'
                size={30}
              />
            </div>
          )}
        </div>
      </BaseSurface>
    </Link>
  );
});

export const StudentDashboardExamList = memo(function ({
  className,
  loading,
  latestExam,
  upcomingExamWithDuration: {
    exam: upcomingExam,
    duration: upcomingExamDuration,
  },
  ongoingExamsWithDurations,
  previousExams,
  ...moreProps
}: Props) {
  const filteredOngoingExamsWithDurations = useMemo(
    () => ongoingExamsWithDurations.slice(0, 2),
    [ongoingExamsWithDurations],
  );

  const filteredPreviousExams = useMemo(
    () => previousExams.slice(0, 2),
    [previousExams],
  );

  return (
    <div
      className={cx('w-full', loading && 'flex flex-col gap-2.5', className)}
      {...moreProps}
    >
      {loading ? (
        [...Array(2)].map((_, index) => (
          <StudentExamSingleCardSkeleton key={index} />
        ))
      ) : (
        <>
          <div className='flex flex-col gap-2.5'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg'>Latest Exams</h3>
              <BaseLink
                to={EXAM_LIST_PATH}
                rightIconName='arrow-circle-right'
                size='xs'
              >
                View All Exams
              </BaseLink>
            </div>
            {!!filteredOngoingExamsWithDurations.length &&
              filteredOngoingExamsWithDurations.map(({ exam, duration }) => (
                <StudentExamSingleCard
                  key={`oe-${exam?.id}`}
                  exam={exam as Exam}
                  ongoingDuration={duration}
                  primary
                  isDashboard
                />
              ))}
            {(ongoingExamsWithDurations.length <= 1 || !upcomingExam) &&
              latestExam && (
                <StudentExamSingleCard exam={latestExam} primary isDashboard />
              )}
            {upcomingExam && (
              <StudentExamSingleCard
                exam={upcomingExam}
                upcomingDuration={upcomingExamDuration}
                primary={!latestExam}
                isDashboard
              />
            )}
          </div>
          <BaseDivider className='mb-2.5 pt-4' />
          <div>
            <h3 className='mb-2.5 text-lg'>Previous Exams</h3>
            {filteredPreviousExams.length ? (
              <ul className='-2lg:flex-row -2lg:gap-5 flex flex-col items-center gap-2.5 xl:flex-col xl:gap-4 2xl:flex-row 2xl:gap-5'>
                {filteredPreviousExams.map((exam) => (
                  <li key={`pe-${exam.id}`} className='w-full'>
                    <ExamCompactCard exam={exam} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className='w-full py-4 text-center'>No exams to show</div>
            )}
          </div>
        </>
      )}
    </div>
  );
});
