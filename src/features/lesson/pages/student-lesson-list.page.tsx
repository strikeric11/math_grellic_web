import { useLoaderData } from 'react-router-dom';

import { useStudentPerformanceSingle } from '#/performance/hooks/use-student-performance-single.hook';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { StudentLessonPerformanceOverview } from '#/performance/components/student-lesson-performance-overview.component';
import { useStudentLessonList } from '../hooks/use-student-lesson-list.hook';
import { StudentLatestLessonList } from '../components/student-latest-lesson-list.component';
import { StudentPreviousLessonList } from '../components/student-previous-lesson-list.component';

export function StudentLessonListPage() {
  const {
    loading,
    latestLesson,
    upcomingLesson,
    previousLessons,
    upcomingDayJsDuration,
    refetch,
  } = useStudentLessonList();

  const { loading: performanceLoading, student: studentPerformance } =
    useStudentPerformanceSingle();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
        <div className='flex w-full flex-1 flex-col self-stretch'>
          <StudentLatestLessonList
            className='mb-5'
            latestLesson={latestLesson}
            upcomingLesson={upcomingLesson}
            upcomingDuration={upcomingDayJsDuration}
            loading={loading}
            onRefresh={refetch}
          />
          <StudentPreviousLessonList
            previousLessons={previousLessons}
            loading={loading}
          />
          <div className='bg-gradient sticky bottom-0 h-20 w-full bg-gradient-to-t from-backdrop from-60% to-transparent' />
        </div>
        <BaseRightSidebar>
          <StudentLessonPerformanceOverview
            studentPerformance={studentPerformance}
            loading={performanceLoading}
          />
        </BaseRightSidebar>
      </div>
    </BaseDataSuspense>
  );
}
