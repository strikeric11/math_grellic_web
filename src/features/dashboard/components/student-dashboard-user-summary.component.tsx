import { memo, useMemo } from 'react';
import cx from 'classix';

import { generateOrdinalSuffix } from '#/utils/string.util';
import { StudentPerformanceType } from '#/performance/models/performance.model';
import { BaseDivider } from '#/base/components/base-divider.component';
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
        'flex gap-4',
        loading ? 'items-center justify-center' : 'items-stretch',
        className,
      )}
      {...moreProps}
    >
      {!performance || loading ? (
        <BaseSpinner />
      ) : (
        <>
          <div className='flex min-w-[400px] animate-fastFadeIn flex-col gap-4'>
            {user && <DashboardUserWelcome user={user} />}
            <BaseDivider />
            <div>
              <div className='mb-5'>
                <h3 className='text-lg'>Overall Rank</h3>
                <span className='text-sm'>
                  Your current position among peers
                </span>
              </div>
              <div className='flex min-w-[230px] items-center gap-5 font-bold text-primary'>
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
          <div>
            <BaseDivider vertical />
          </div>
          <div className='animate-fastFadeIn'>
            <div className='mb-4'>
              <h3 className='text-lg'>Overall Progress</h3>
              <span className='text-sm'>Track your academic journey</span>
            </div>
            <div className='flex items-start gap-6'>
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
