import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useTeacherClassPerformance } from '../hooks/use-teacher-class-performance.hook';
import { useTeacherCurriculumSnippets } from '../hooks/use-teacher-curriculum-snippets.hook';
import { TeacherDashboardUserSummary } from '../components/teacher-dashboard-user-summary.component';
import { TeacherDashboardCurriculumTabList } from '../components/teacher-dashboard-curriculum-tab-list.component';
import { TeacherDashboardStudentLeaderboard } from '../components/teacher-dashboard-student-leaderboard.component';

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

  const {
    loading: curriculumLoading,
    lessons,
    exams,
    activities,
  } = useTeacherCurriculumSnippets();

  return (
    <div className='flex items-start gap-5'>
      <div className='flex min-w-[835px] flex-col gap-5 pb-8'>
        <TeacherDashboardUserSummary
          className='min-h-[262px]'
          user={user}
          classPerformance={teacherClassPerformance}
          loading={!user || classLoading}
        />
        <TeacherDashboardCurriculumTabList
          lessons={lessons}
          exams={exams}
          activities={activities}
          loading={curriculumLoading}
        />
        <TeacherDashboardStudentLeaderboard
          className='min-h-[224px]'
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
