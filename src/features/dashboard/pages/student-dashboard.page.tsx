import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useStudentPerformanceSingle } from '#/performance/hooks/use-student-performance-single.hook';
import { useStudentScheduleTodayList } from '#/schedule/hooks/use-student-schedule-today-list.hook';
import { BaseSurface } from '#/base/components/base-surface.component';
import { ScheduleDailyCardList } from '#/schedule/components/schedule-daily-card-list.component';
import { useStudentAnnouncementList } from '#/announcement/hooks/use-student-announcement-list.hook';
import { useStudentCurriculumSnippets } from '../hooks/use-student-curriculum-snippets.hook';
import { StudentDashboardUserSummary } from '../components/student-dashboard-user-summary.component';
import { StudentDashboardCurriculumTabList } from '../components/student-dashboard-curriculum-tab-list.component';
import { StudentDashboardAnnouncementList } from '../components/student-dashboard-announcement-list.component';
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

  const {
    loading: announcementListLoading,
    studentAnnouncements,
    refresh: refreshAnnouncements,
  } = useStudentAnnouncementList();

  return (
    <div className='max-w-auto mx-auto flex w-full flex-col items-center justify-center gap-5 pb-8 sm:max-w-[592px] -2lg:max-w-[835px] xl:flex-row xl:items-start'>
      <div className='xl:max-w-auto flex w-full shrink-0 flex-col gap-5 xl:w-[592px] xl:pb-8 2xl:w-auto 2xl:max-w-[835px]'>
        <StudentDashboardUserSummary
          className='min-h-[262px]'
          user={user}
          studentPerformance={studentPerformance}
          loading={!user || performanceLoading}
        />
        <StudentDashboardAnnouncementList
          className='block -2lg:hidden'
          loading={announcementListLoading}
          studentAnnouncements={studentAnnouncements}
          onRefresh={refreshAnnouncements}
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
      <div className='flex w-full flex-col gap-5 -2lg:w-fit'>
        <StudentDashboardAnnouncementList
          className='hidden min-h-[262px] -2lg:block'
          loading={announcementListLoading}
          studentAnnouncements={studentAnnouncements}
          onRefresh={refreshAnnouncements}
        />
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
