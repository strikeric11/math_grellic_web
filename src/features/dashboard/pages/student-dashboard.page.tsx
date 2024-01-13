import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useStudentPerformanceSingle } from '#/performance/hooks/use-student-performance-single.hook';
import { useStudentScheduleTodayList } from '#/schedule/hooks/use-student-schedule-today-list.hook';
import { BaseSurface } from '#/base/components/base-surface.component';
import { ScheduleDailyCardList } from '#/schedule/components/schedule-daily-card-list.component';
import { useStudentCurriculumSnippets } from '../hooks/use-student-curriculum-snippets.hook';
import { StudentDashboardUserSummary } from '../components/student-dashboard-user-summary.component';
import { StudentDashboardCurriculumTabList } from '../components/student-dashboard-curriculum-tab-list.component';
import { StudentDashboardHelpCard } from '../components/student-dashboard-help-card.component';

const SCHEDULE_PATH = `/${studentBaseRoute}/${studentRoutes.schedule.to}`;

export function StudentDashboardPage() {
  const user = useBoundStore((state) => state.user || null);

  const { loading: performanceLoading, student: studentPerformance } =
    useStudentPerformanceSingle();

  const {
    loading,
    latestLesson,
    upcomingLessonWithDuration,
    previousLessons,
    latestExam,
    previousExams,
    upcomingExamWithDuration,
    ongoingExamsWithDurations,
    activities,
    refresh,
  } = useStudentCurriculumSnippets();

  const { loading: todayScheduleLoading, schedules } =
    useStudentScheduleTodayList();

  return (
    <div className='flex items-start justify-center gap-5'>
      <div className='flex min-w-[835px] flex-col gap-5 pb-8'>
        <StudentDashboardUserSummary
          className='min-h-[262px]'
          user={user}
          studentPerformance={studentPerformance}
          loading={!user || performanceLoading}
        />
        <StudentDashboardCurriculumTabList
          latestLesson={latestLesson}
          upcomingLessonWithDuration={upcomingLessonWithDuration}
          previousLessons={previousLessons}
          latestExam={latestExam}
          previousExams={previousExams}
          upcomingExamWithDuration={upcomingExamWithDuration}
          ongoingExamsWithDurations={ongoingExamsWithDurations}
          activities={activities}
          loading={loading}
          refresh={refresh}
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
        <StudentDashboardHelpCard />
      </div>
    </div>
  );
}
