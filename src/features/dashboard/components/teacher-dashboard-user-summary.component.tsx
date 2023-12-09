import { memo } from 'react';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { DashboardUserWelcome } from './dashboard-user-welcome.component';
import { DashboardShortcutMenu } from './dashboard-shortcut-menu.component';

import type { ComponentProps } from 'react';
import type { TeacherUserAccount } from '#/user/models/user.model';
import type { GroupLink } from '#/base/models/base.model';

type Props = ComponentProps<typeof BaseSurface> & {
  loading?: boolean;
  userAccount?: TeacherUserAccount;
};

const links = [
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.lesson.to}/${teacherRoutes.lesson.createTo}`,
    icons: [
      { name: 'plus', size: 16 },
      { name: 'chalkboard-teacher' },
    ] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.exam.to}/${teacherRoutes.exam.createTo}`,
    icons: [{ name: 'plus', size: 16 }, { name: 'exam' }] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.activity.to}/${teacherRoutes.activity.createTo}`,
    icons: [
      { name: 'plus', size: 16 },
      { name: 'game-controller' },
    ] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.schedule.to}/${teacherRoutes.schedule.meeting.to}/${teacherRoutes.schedule.meeting.createTo}`,
    icons: [
      { name: 'plus', size: 16 },
      { name: 'calendar' },
    ] as GroupLink['icons'],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.student.to}/${teacherRoutes.student.createTo}`,
    icons: [
      { name: 'plus', size: 16 },
      { name: 'users-four' },
    ] as GroupLink['icons'],
  },
];

export const TeacherDashboardUserSummary = memo(function ({
  className,
  loading,
  userAccount,
  ...moreProps
}: Props) {
  return (
    <BaseSurface
      className={cx(
        'flex min-h-[120px] !w-fit items-center',
        loading && 'justify-center',
        className,
      )}
      {...moreProps}
    >
      {loading ? (
        <BaseSpinner />
      ) : (
        <>
          <div className='flex min-w-[400px] flex-col gap-4'>
            <DashboardUserWelcome
              userAccount={userAccount as TeacherUserAccount}
            />
            <BaseDivider />
            <DashboardShortcutMenu className='min-h-[100px]' links={links} />
          </div>
          <BaseDivider vertical />
          <div>{/* TODO progress */}</div>
        </>
      )}
    </BaseSurface>
  );
});
