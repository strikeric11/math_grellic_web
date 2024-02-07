import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseSurface } from '#/base/components/base-surface.component';
import { useTeacherScheduleTodayList } from '#/schedule/hooks/use-teacher-schedule-today-list.hook';
import { ScheduleDailyCardList } from '#/schedule/components/schedule-daily-card-list.component';
import { useTeacherAnnouncementList } from '#/announcement/hooks/use-teacher-announcement-list.hook';
import { useAnnouncementCreate } from '#/announcement/hooks/use-announcement-create.hook';
import { useAnnouncementEdit } from '#/announcement/hooks/use-announcement-edit.hook';
import { useTeacherClassPerformance } from '../hooks/use-teacher-class-performance.hook';
import { useTeacherCurriculumSnippets } from '../hooks/use-teacher-curriculum-snippets.hook';
import { TeacherDashboardUserSummary } from '../components/teacher-dashboard-user-summary.component';
import { TeacherDashboardCurriculumTabList } from '../components/teacher-dashboard-curriculum-tab-list.component';
import { TeacherDashboardStudentLeaderboard } from '../components/teacher-dashboard-student-leaderboard.component';
import { TeacherDashboardAnnouncementList } from '../components/teacher-dashboard-announcement-list.component';

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
    handleLessonDetails,
    handleExamDetails,
    handleActivityDetails,
  } = useTeacherCurriculumSnippets();

  const { loading: todayScheduleLoading, schedules } =
    useTeacherScheduleTodayList();

  const {
    loading: announcementListLoading,
    teacherAnnouncements,
    refresh,
  } = useTeacherAnnouncementList();

  const { loading: announcementCreateLoading, createAnnouncement } =
    useAnnouncementCreate();

  const {
    loading: announcemenEditLoading,
    editAnnouncement,
    deleteAnnouncement,
  } = useAnnouncementEdit();

  return (
    <div className='max-w-auto mx-auto flex w-full flex-col items-center justify-center gap-5 pb-8 sm:max-w-[592px] -2lg:max-w-[835px] xl:flex-row xl:items-start'>
      <div className='xl:max-w-auto flex w-full shrink-0 flex-col gap-5 xl:w-[592px] xl:pb-8 2xl:w-auto 2xl:max-w-[835px]'>
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
          onLessonDetails={handleLessonDetails}
          onExamDetails={handleExamDetails}
          onActivityDetails={handleActivityDetails}
        />
        <TeacherDashboardStudentLeaderboard
          className='min-h-[224px]'
          performance={currentRankingsPerformance}
          students={studentRankingsPerformances}
          loading={rankingsLoading}
          onTabChange={setCurrentRankingsPerformance}
        />
      </div>
      <div className='flex w-full flex-col gap-5 -2lg:w-fit'>
        <TeacherDashboardAnnouncementList
          loading={
            announcementListLoading ||
            announcementCreateLoading ||
            announcemenEditLoading
          }
          teacherAnnouncements={teacherAnnouncements}
          onCreate={createAnnouncement}
          onEdit={editAnnouncement}
          onDelete={deleteAnnouncement}
          onRefresh={refresh}
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
      </div>
    </div>
  );
}
