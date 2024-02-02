import { Fragment, memo, useCallback, useMemo } from 'react';
import { Tab } from '@headlessui/react';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { generateOrdinalSuffix } from '#/utils/string.util';
import { StudentPerformanceType } from '#/performance/models/performance.model';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { PerformanceRankAwardImg } from '#/performance/components/performance-rank-award-img.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '#/performance/models/performance.model';

type Props = ComponentProps<typeof BaseSurface> & {
  students: StudentPerformance[];
  performance: StudentPerformanceType;
  title?: string;
  loading?: boolean;
  onTabChange?: (value: StudentPerformanceType) => void;
};

type StudentRankCardProps = {
  student: StudentPerformance;
  performance: StudentPerformanceType;
};

const STUDENT_PERFORMANCE_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.performance.to}`;

const tabCategories = {
  exam: {
    name: StudentPerformanceType.Exam,
    label: 'Exam',
  },
  activity: {
    name: StudentPerformanceType.Activity,
    label: 'Activity',
  },
};

const StudentRankCard = memo(function ({
  student,
  performance,
}: StudentRankCardProps) {
  const [lastName, firstWithMiddleName] = useMemo(
    () => [
      `${student.lastName},`,
      `${student.firstName}${
        student.middleName ? ` ${student.middleName[0]}` : ''
      }`,
    ],
    [student],
  );

  const overallRank = useMemo(
    () =>
      performance === StudentPerformanceType.Exam
        ? student.overallExamRank
        : student.overallActivityRank,
    [performance, student],
  );

  const overallRankText = useMemo(
    () => (overallRank == null ? '-' : generateOrdinalSuffix(overallRank)),
    [overallRank],
  );

  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-2.5 p-2.5'>
      <div
        className={cx(
          'flex h-10 w-28 items-center justify-center gap-x-2.5 font-bold sm:w-fit',
          performance === StudentPerformanceType.Exam &&
            '!text-primary-hue-purple',
          performance === StudentPerformanceType.Activity &&
            '!text-primary-hue-teal',
        )}
      >
        <span className='text-3xl'>{overallRankText}</span>
        {overallRank != null && overallRank <= 10 && (
          <PerformanceRankAwardImg rank={overallRank} />
        )}
      </div>
      <h4 className='flex flex-row items-center justify-start font-body text-base font-medium leading-tight tracking-normal text-accent sm:flex-col'>
        <span>{lastName}</span>
        <span>{firstWithMiddleName}</span>
      </h4>
    </div>
  );
});

export const TeacherDashboardStudentLeaderboard = memo(function ({
  className,
  title = 'Student Rankings',
  loading,
  performance,
  students,
  onTabChange,
  ...moreProps
}: Props) {
  const offsetStudentCount = useMemo(() => {
    const value = 5 - students.length;
    return value < 0 ? 0 : value;
  }, [students]);

  const setClassName = useCallback(
    ({ selected }: { selected: boolean }) =>
      cx(
        'border-b-2 p-2.5 font-display font-bold leading-none tracking-tighter outline-0 transition-all hover:text-primary',
        selected
          ? 'border-b-primary text-primary'
          : 'border-b-transparent text-primary/60',
      ),
    [],
  );

  const handleTabChange = useCallback(
    (value: StudentPerformanceType) => () => onTabChange && onTabChange(value),
    [onTabChange],
  );

  return (
    <BaseSurface
      className={cx('flex flex-col justify-between !py-2.5', className)}
      {...moreProps}
    >
      <Tab.Group>
        <div className='relative flex w-full items-baseline justify-between'>
          <div className='absolute bottom-0 left-0 h-0.5 w-full bg-primary/20' />
          <h2 className='text-lg'>{title}</h2>
          <Tab.List className='relative z-10 flex'>
            {Object.values(tabCategories).map(({ name, label }) => (
              <Tab
                key={name}
                className={setClassName}
                onClick={handleTabChange(name)}
              >
                {label}
              </Tab>
            ))}
          </Tab.List>
        </div>
        <Tab.Panels className='pt-4'>
          {loading ? (
            <div className='flex w-full items-center justify-center'>
              <BaseSpinner />
            </div>
          ) : (
            <div className='flex animate-fastFadeIn items-stretch'>
              <div className='items-star flex flex-1 flex-col sm:flex-row'>
                {students.map((student, index) => (
                  <Fragment key={`stu-${student.id}`}>
                    <StudentRankCard
                      student={student}
                      performance={performance}
                    />
                    {!offsetStudentCount
                      ? index < students.length - 1
                      : students.length + offsetStudentCount - 1 && (
                          <>
                            <BaseDivider className='hidden sm:block' vertical />
                            <BaseDivider className='block sm:hidden' />
                          </>
                        )}
                  </Fragment>
                ))}
                {[...Array(offsetStudentCount)].map((_, index) => (
                  <Fragment key={index}>
                    <div className='flex-1 basis-[90px] sm:basis-0' />
                    {index < offsetStudentCount - 1 && (
                      <>
                        <BaseDivider className='hidden sm:block' vertical />
                        <BaseDivider className='block sm:hidden' />
                      </>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          )}
        </Tab.Panels>
      </Tab.Group>
      <div className='w-full pt-2.5 text-right'>
        <BaseLink
          to={STUDENT_PERFORMANCE_LIST_PATH}
          rightIconName='arrow-circle-right'
          size='xs'
        >
          View Performances
        </BaseLink>
      </div>
    </BaseSurface>
  );
});
