import cx from 'classix';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useTeacherClassPerformance } from '../hooks/use-teacher-class-performance.hook';
import { TeacherDashboardUserSummary } from '../components/teacher-dashboard-user-summary.component';
import { TeacherDashboardStudentLeaderboard } from '../components/teacher-dashboard-student-leaderboard.component';

const LEFT_CLASSNAME = 'min-w-[835px]';

export function TeacherDashboardPage() {
  const user = useBoundStore((state) => state.user || null);

  const {
    classLoading,
    rankingsLoading,
    teacherClassPerformance,
    studentRankingsPerformances,
    currentRankingsPerformance,
    setCurrentRankingsPerformance,
  } = useTeacherClassPerformance();

  return (
    <div className='flex items-start gap-5'>
      <div className='flex flex-col gap-5'>
        <TeacherDashboardUserSummary
          className={cx('min-h-[262px]', LEFT_CLASSNAME)}
          user={user}
          classPerformance={teacherClassPerformance}
          loading={!user || classLoading}
        />
        <TeacherDashboardStudentLeaderboard
          className={cx('min-h-[224px]', LEFT_CLASSNAME)}
          performance={currentRankingsPerformance}
          students={studentRankingsPerformances}
          loading={rankingsLoading}
          onTabChange={setCurrentRankingsPerformance}
        />
      </div>
      <div>{/* TODO announcements, ...etc */}</div>
    </div>
  );
}
