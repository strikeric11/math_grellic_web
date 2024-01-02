import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useStudentPerformanceSingle } from '#/performance/hooks/use-student-performance-single.hook';
import { useStudentCurriculumSnippets } from '../hooks/use-student-curriculum-snippets.hook';
import { StudentDashboardUserSummary } from '../components/student-dashboard-user-summary.component';
import { StudentDashboardCurriculumTabList } from '../components/student-dashboard-curriculum-tab-list.component';

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

  return (
    <div className='flex items-start gap-5'>
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
      <div>{/* TODO announcements, ...etc */}</div>
    </div>
  );
}
