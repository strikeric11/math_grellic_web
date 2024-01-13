import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseSurface } from '#/base/components/base-surface.component';
import { useTeacherScheduleTodayList } from '#/schedule/hooks/use-teacher-schedule-today-list.hook';
import { ScheduleDailyCardList } from '#/schedule/components/schedule-daily-card-list.component';
import { useTeacherClassPerformance } from '../hooks/use-teacher-class-performance.hook';
import { useTeacherCurriculumSnippets } from '../hooks/use-teacher-curriculum-snippets.hook';
import { TeacherDashboardUserSummary } from '../components/teacher-dashboard-user-summary.component';
import { TeacherDashboardCurriculumTabList } from '../components/teacher-dashboard-curriculum-tab-list.component';
import { TeacherDashboardStudentLeaderboard } from '../components/teacher-dashboard-student-leaderboard.component';

const SCHEDULE_PATH = `/${teacherBaseRoute}/${teacherRoutes.schedule.to}`;

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

  const { loading: todayScheduleLoading, schedules } =
    useTeacherScheduleTodayList();

  return (
    <div className='flex items-start justify-center gap-5'>
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
      <div className='flex flex-col gap-5'>
        <BaseSurface className='!px-4 pb-3'>
          <h3 className='mb-2.5 text-lg leading-none'>Today's Schedule</h3>
          <ScheduleDailyCardList
            schedules={schedules}
            scheduleTo={SCHEDULE_PATH}
            scheduleEmptyLabel='No schedule for today'
            loading={todayScheduleLoading}
            fixedWidth
          />
        </BaseSurface>
      </div>
    </div>
  );
}
