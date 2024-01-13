import { Fragment, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { generateOrdinalSuffix } from '#/utils/string.util';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { StudentPerformanceType } from '#/performance/models/performance.model';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { PerformanceRankAwardImg } from './performance-rank-award-img.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '#/performance/models/performance.model';
import { BaseLink } from '#/base/components/base-link.component';

type Props = ComponentProps<'div'> & {
  students: StudentPerformance[];
  performance: StudentPerformanceType;
  title?: string;
  loading?: boolean;
};

type StudentRankCardProps = {
  student: StudentPerformance;
  performance: StudentPerformanceType;
};

const PERFORMANCE_PATH = `/${teacherBaseRoute}/${teacherRoutes.performance.to}`;

const StudentRankCard = memo(function ({
  student,
  performance,
}: StudentRankCardProps) {
  const [to, lastName, firstWithMiddleName, overallRank, overallScore] =
    useMemo(
      () => [
        `${PERFORMANCE_PATH}/${student.publicId?.toLowerCase() || ''}`,
        `${student.lastName},`,
        `${student.firstName}${
          student.middleName ? ` ${student.middleName[0]}` : ''
        }`,
        performance === StudentPerformanceType.Exam
          ? student.overallExamRank
          : student.overallActivityRank,
        performance === StudentPerformanceType.Exam
          ? student.overallExamScore
          : student.overallActivityScore,
      ],
      [student, performance],
    );

  const overallRankText = useMemo(
    () => (overallRank == null ? '-' : generateOrdinalSuffix(overallRank)),
    [overallRank],
  );

  const overallScoreText = useMemo(() => {
    if (overallScore == null) {
      return '-';
    }

    const pointText = overallScore > 1 ? 'Points' : 'Point';
    return `${overallScore} ${pointText}`;
  }, [overallScore]);

  return (
    <Link to={to} className='group'>
      <div
        className={cx(
          'flex w-full flex-1 items-center gap-2 rounded font-bold group-hover:!text-white',
          performance === StudentPerformanceType.Exam &&
            '!text-primary-hue-purple group-hover:bg-primary-hue-purple-focus',
          performance === StudentPerformanceType.Activity &&
            '!text-primary-hue-teal group-hover:bg-primary-hue-teal-focus',
        )}
      >
        <div className='flex w-24 shrink-0 items-center justify-center gap-x-2.5'>
          <span className='text-2xl'>{overallRankText}</span>
          {overallRank != null && overallRank <= 10 && (
            <PerformanceRankAwardImg rank={overallRank} size='sm' />
          )}
        </div>
        <BaseDivider className='!h-10' vertical />
        <span className='inline-block w-24 shrink-0 text-center font-display text-lg tracking-tighter'>
          {overallScoreText}
        </span>
        <BaseDivider className='!h-10' vertical />
        <div className='flex flex-1 flex-col text-center text-sm font-medium leading-tight text-accent group-hover:text-white'>
          <span>{lastName}</span>
          <span>{firstWithMiddleName}</span>
        </div>
      </div>
    </Link>
  );
});

export const TeacherStudentPerformanceLeaderboard = memo(function ({
  className,
  loading,
  students,
  performance,
  title = 'Student Rankings',
  ...moreProps
}: Props) {
  const offsetStudentCount = useMemo(() => {
    const value = 5 - students.length;
    return value < 0 ? 0 : value;
  }, [students]);

  return (
    <div className={cx('flex flex-col gap-2.5', className)} {...moreProps}>
      <h2 className='text-lg'>{title}</h2>
      {loading ? (
        <div className='flex w-full items-center justify-center'>
          <BaseSpinner />
        </div>
      ) : (
        <BaseSurface
          rounded='sm'
          className='flex animate-fastFadeIn justify-center !p-4'
        >
          <div className='flex flex-1 flex-col gap-2.5'>
            {students.map((student, index) => (
              <Fragment key={`stu-${student.id}`}>
                <StudentRankCard student={student} performance={performance} />
                {!offsetStudentCount
                  ? index < students.length - 1
                  : students.length + offsetStudentCount - 1 && <BaseDivider />}
              </Fragment>
            ))}
            {[...Array(offsetStudentCount)].map((_, index) => (
              <Fragment key={index}>
                <div className='flex h-10 items-center justify-center font-display text-lg tracking-tighter'>
                  -
                </div>
                {index < offsetStudentCount - 1 && <BaseDivider />}
              </Fragment>
            ))}
          </div>
        </BaseSurface>
      )}
      <div className='flex flex-1 items-center justify-center'>
        <BaseLink
          to={PERFORMANCE_PATH}
          rightIconName='arrow-circle-right'
          size='xs'
        >
          View Performances
        </BaseLink>
      </div>
    </div>
  );
});
