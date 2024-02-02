import { memo, useMemo } from 'react';
import cx from 'classix';

import { generateOrdinalSuffix } from '#/utils/string.util';
import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { StudentPerformanceType } from '#/performance/models/performance.model';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { PerformanceRankAwardImg } from '#/performance/components/performance-rank-award-img.component';
import { DashboardUserWelcome } from './dashboard-user-welcome.component';

import type { ComponentProps } from 'react';
import type { User } from '#/user/models/user.model';
import type { StudentPerformance } from '#/performance/models/performance.model';

type Props = ComponentProps<typeof BaseSurface> & {
  user: User | null;
  studentPerformance?: StudentPerformance | null;
  loading?: boolean;
};

const USER_ACCOUNT_PATH = `/${studentBaseRoute}/${studentRoutes.account.to}`;
const PERFORMANCE_PATH = `/${studentBaseRoute}/${studentRoutes.performance.to}`;

export const StudentDashboardUserSummary = memo(function ({
  className,
  loading,
  user,
  studentPerformance,
  ...moreProps
}: Props) {
  const [overallRank, overallRankText, overallScore] = useMemo(
    () => [
      studentPerformance?.overallExamRank,
      studentPerformance?.overallExamRank == null
        ? '-'
        : generateOrdinalSuffix(studentPerformance.overallExamRank),
      studentPerformance?.overallExamScore,
    ],
    [studentPerformance],
  );

  const overallScoreText = useMemo(() => {
    if (overallScore == null) {
      return '';
    }

    const pointText = overallScore > 1 ? 'Points' : 'Point';
    return `${overallScore} ${pointText}`;
  }, [overallScore]);

  const performances = useMemo(() => {
    const {
      overallLessonCompletionPercent,
      overallExamCompletionPercent,
      overallActivityCompletionPercent,
    } = studentPerformance || {};

    return [
      {
        value: overallLessonCompletionPercent || 0,
        performace: StudentPerformanceType.Lesson,
        label: 'Lessons',
      },
      {
        value: overallExamCompletionPercent || 0,
        performace: StudentPerformanceType.Exam,
        label: 'Exams',
      },
      {
        value: overallActivityCompletionPercent || 0,
        performace: StudentPerformanceType.Activity,
        label: 'Activities',
      },
    ];
  }, [studentPerformance]);

  return (
    <BaseSurface
      className={cx(
        'flex flex-col gap-4 -2lg:flex-row xl:flex-col 2xl:flex-row',
        loading ? 'items-center justify-center' : 'items-stretch',
        className,
      )}
      {...moreProps}
    >
      {!performance || loading ? (
        <BaseSpinner />
      ) : (
        <>
          <div className='flex w-full animate-fastFadeIn flex-col gap-4 2xl:min-w-[400px]'>
            {user && (
              <DashboardUserWelcome to={USER_ACCOUNT_PATH} user={user} />
            )}
            <BaseDivider />
            <div>
              <div className='mb-5 flex flex-col items-start justify-between -3xs:flex-row'>
                <div className='mb-1.5 -3xs:mb-0'>
                  <h3 className='text-lg'>Overall Rank</h3>
                  <span className='text-sm'>
                    Your current position among peers
                  </span>
                </div>
                <BaseLink
                  to={PERFORMANCE_PATH}
                  rightIconName='arrow-circle-right'
                  size='xs'
                >
                  Detailed View
                </BaseLink>
              </div>
              <div className='flex min-w-[230px] items-center justify-center gap-5 font-bold text-primary -2lg:justify-start xl:justify-center 2xl:justify-start'>
                <div className='flex items-center gap-x-2.5'>
                  <span className='text-4xl'>{overallRankText}</span>
                  {overallRank != null && overallRank <= 10 && (
                    <PerformanceRankAwardImg rank={overallRank} />
                  )}
                </div>
                {!!overallScore && (
                  <>
                    <BaseDivider className='!h-10' vertical />
                    <span className='font-display text-2xl tracking-tighter'>
                      {overallScoreText}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className='hidden -2lg:block xl:hidden 2xl:block'>
            <BaseDivider vertical />
          </div>
          <BaseDivider className='mb-1.5 mt-1 block -2lg:hidden xl:block 2xl:hidden' />
          <div className='animate-fastFadeIn'>
            <div className='mb-4'>
              <h3 className='text-lg'>Overall Progress</h3>
              <span className='text-sm'>Track your academic journey</span>
            </div>
            <div className='flex flex-col items-center justify-center gap-4 -3xs:flex-row -3xs:items-start -3xs:gap-6 -2xs:gap-12 -2lg:gap-6 xl:gap-12 2xl:gap-6'>
              {performances.map(({ value, performace, label }, index) => (
                <BaseProgressCircle
                  key={`progress-${index}`}
                  percent={value}
                  performance={performace}
                  label={label}
                  bottomLabelPosition
                />
              ))}
            </div>
          </div>
        </>
      )}
    </BaseSurface>
  );
});
