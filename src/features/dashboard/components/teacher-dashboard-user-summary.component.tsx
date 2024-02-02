import { memo, useMemo } from 'react';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { StudentPerformanceType } from '#/performance/models/performance.model';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { DashboardUserWelcome } from './dashboard-user-welcome.component';
import { DashboardShortcutMenu } from './dashboard-shortcut-menu.component';

import type { ComponentProps } from 'react';
import type { GroupLink } from '#/base/models/base.model';
import type { User } from '#/user/models/user.model';
import type { TeacherClassPerformance } from '#/performance/models/performance.model';

type Props = ComponentProps<typeof BaseSurface> & {
  user: User | null;
  classPerformance: TeacherClassPerformance | null;
  loading?: boolean;
};

const USER_ACCOUNT_PATH = `/${teacherBaseRoute}/${teacherRoutes.account.to}`;

const links = [
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.lesson.to}/${teacherRoutes.lesson.createTo}`,
    label: 'New lesson',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'chalkboard-teacher' },
    ] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.exam.to}/${teacherRoutes.exam.createTo}`,
    label: 'New exam',
    icons: [{ name: 'plus', size: 16 }, { name: 'exam' }] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.activity.to}/${teacherRoutes.activity.createTo}`,
    label: 'New activity',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'game-controller' },
    ] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.schedule.to}/${teacherRoutes.schedule.meeting.to}/${teacherRoutes.schedule.meeting.createTo}`,
    label: 'Schedule meeting',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'calendar' },
    ] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.student.to}/${teacherRoutes.student.createTo}`,
    label: 'Enroll student',
    icons: [
      { name: 'plus', size: 16 },
      { name: 'users-four' },
    ] as GroupLink['icons'],
  },
];

export const TeacherDashboardUserSummary = memo(function ({
  className,
  loading,
  user,
  classPerformance,
  ...moreProps
}: Props) {
  const performances = useMemo(() => {
    const {
      overallLessonCompletionPercent,
      overallExamCompletionPercent,
      overallActivityCompletionPercent,
    } = classPerformance || {};

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
  }, [classPerformance]);

  return (
    <BaseSurface
      className={cx(
        'flex flex-col gap-4 -2lg:flex-row xl:flex-col 2xl:flex-row',
        loading ? 'items-center justify-center' : 'items-stretch',
        className,
      )}
      {...moreProps}
    >
      {loading ? (
        <BaseSpinner />
      ) : (
        <>
          <div className='flex w-full animate-fastFadeIn flex-col gap-4 2xl:min-w-[400px]'>
            {user && (
              <DashboardUserWelcome to={USER_ACCOUNT_PATH} user={user} />
            )}
            <BaseDivider />
            <DashboardShortcutMenu
              className='h-full min-h-[100px]'
              links={links}
            />
          </div>
          <div className='hidden -2lg:block xl:hidden 2xl:block'>
            <BaseDivider vertical />
          </div>
          <BaseDivider className='mb-1.5 mt-1 block -2lg:hidden xl:block 2xl:hidden' />
          <div className='animate-fastFadeIn'>
            <div className='mb-4'>
              <h3 className='text-lg leading-none'>Overall Class Progress</h3>
              <span className='text-sm'>
                Track your class overall completion
              </span>
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
